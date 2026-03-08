package com.example.dahaeng.youtube.service;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
import com.example.dahaeng.youtube.entity.YouTubeAccount;
import com.example.dahaeng.youtube.entity.YouTubePlaylist;
import com.example.dahaeng.youtube.entity.YouTubeVideo;
import com.example.dahaeng.youtube.enums.PrivacyStatus;
import com.example.dahaeng.youtube.enums.SnapshotType;
import com.example.dahaeng.youtube.enums.SyncStatus;
import com.example.dahaeng.youtube.service.YouTubeFetchService.YouTubeApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class YouTubeSyncService {

    private final MemberRepository memberRepository;
    private final YouTubeFetchService fetchService;
    private final YouTubeSaveService saveService;

    @Transactional
    public void sync(CustomOAuth2User principal) {
        Member member = memberRepository.findById(principal.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        String accessToken = member.getGoogleAccessToken();
        if (accessToken == null || accessToken.isBlank()) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "구글 연동 정보가 없습니다.");
        }

        LocalDateTime now = LocalDateTime.now();

        YouTubeApiResponse channelResp = fetchService.fetchMyChannel(accessToken);
        String youtubeChannelId = extractFirstChannelId(channelResp.body());

        YouTubeAccount account = saveService.upsertAccount(
                member,
                youtubeChannelId,
                member.getEmail(),
                member.getGoogleAccessToken(),
                member.getGoogleRefreshToken()
        );

        try {
            saveService.updateSyncStatus(account, SyncStatus.PENDING, account.getLastSyncedAt());

            YouTubeApiResponse playlistsResp = fetchService.fetchPlaylists(accessToken);
            saveService.insertSnapshot(account, SnapshotType.PLAYLISTS, playlistsResp.rawJson(), now);

            List<Map<String, Object>> playlists = getItems(playlistsResp.body());
            Map<String, YouTubePlaylist> playlistMap = new HashMap<>();

            for (Map<String, Object> pl : playlists) {
                String playlistId = (String) pl.get("id");
                Map<String, Object> snippet = getMap(pl.get("snippet"));
                Map<String, Object> status = getMap(pl.get("status"));

                String title = (String) snippet.get("title");
                String privacy = status.get("privacyStatus") != null ? status.get("privacyStatus").toString() : "PRIVATE";

                YouTubePlaylist saved = saveService.upsertPlaylist(
                        account,
                        playlistId,
                        title,
                        PrivacyStatus.valueOf(privacy.toUpperCase()),
                        now
                );
                playlistMap.put(playlistId, saved);
            }

            Set<String> videoIds = new HashSet<>();
            Map<String, Integer> playlistPosition = new HashMap<>();

            for (String playlistId : playlistMap.keySet()) {
                YouTubeApiResponse itemsResp = fetchService.fetchPlaylistItems(accessToken, playlistId);
                saveService.insertSnapshot(account, SnapshotType.PLAYLIST_ITEMS, itemsResp.rawJson(), now);

                List<Map<String, Object>> items = getItems(itemsResp.body());
                for (Map<String, Object> item : items) {
                    Map<String, Object> contentDetails = getMap(item.get("contentDetails"));
                    Map<String, Object> snippet = getMap(item.get("snippet"));
                    String videoId = (String) contentDetails.get("videoId");
                    if (videoId == null) {
                        continue;
                    }
                    Integer position = snippet.get("position") instanceof Number ? ((Number) snippet.get("position")).intValue() : null;
                    playlistPosition.put(playlistId + ":" + videoId, position);
                    videoIds.add(videoId);
                }
            }

            YouTubeApiResponse subscriptionsResp = fetchService.fetchSubscriptions(accessToken);
            saveService.insertSnapshot(account, SnapshotType.SUBSCRIPTIONS, subscriptionsResp.rawJson(), now);
            List<Map<String, Object>> subscriptions = getItems(subscriptionsResp.body());
            for (Map<String, Object> sub : subscriptions) {
                Map<String, Object> snippet = getMap(sub.get("snippet"));
                Map<String, Object> resourceId = getMap(snippet.get("resourceId"));

                String channelId = resourceId.get("channelId") != null ? resourceId.get("channelId").toString() : null;
                String title = snippet.get("title") != null ? snippet.get("title").toString() : null;
                String description = snippet.get("description") != null ? snippet.get("description").toString() : null;
                LocalDateTime subscribedAt = parseDateTime(snippet.get("publishedAt"));

                if (channelId != null) {
                    saveService.upsertSubscription(account, channelId, title, description, subscribedAt, now);
                }
            }

            YouTubeApiResponse likedResp = fetchService.fetchLikedVideos(accessToken);
            saveService.insertSnapshot(account, SnapshotType.LIKED_VIDEOS, likedResp.rawJson(), now);
            List<Map<String, Object>> likedVideos = getItems(likedResp.body());
            for (Map<String, Object> item : likedVideos) {
                String videoId = (String) item.get("id");
                if (videoId != null) {
                    videoIds.add(videoId);
                }
            }

            Map<String, YouTubeVideo> videoMap = new HashMap<>();
            for (String videoId : videoIds) {
                YouTubeApiResponse videoResp = fetchService.fetchVideoDetails(accessToken, videoId);
                saveService.insertSnapshot(account, SnapshotType.VIDEO_DETAILS, videoResp.rawJson(), now);

                List<Map<String, Object>> items = getItems(videoResp.body());
                if (items.isEmpty()) {
                    continue;
                }
                Map<String, Object> snippet = getMap(items.get(0).get("snippet"));
                String title = snippet.get("title") != null ? snippet.get("title").toString() : null;
                String channelTitle = snippet.get("channelTitle") != null ? snippet.get("channelTitle").toString() : null;
                String categoryId = snippet.get("categoryId") != null ? snippet.get("categoryId").toString() : null;
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) snippet.get("tags");

                YouTubeVideo saved = saveService.upsertVideo(videoId, title, channelTitle, categoryId);
                saveService.insertVideoTags(saved, tags);
                videoMap.put(videoId, saved);
            }

            for (String key : playlistPosition.keySet()) {
                String[] parts = key.split(":", 2);
                String playlistId = parts[0];
                String videoId = parts[1];
                YouTubePlaylist playlist = playlistMap.get(playlistId);
                YouTubeVideo video = videoMap.get(videoId);
                if (playlist != null && video != null) {
                    saveService.insertPlaylistVideo(playlist, video, playlistPosition.get(key), now);
                }
            }

            for (Map<String, Object> item : likedVideos) {
                String videoId = (String) item.get("id");
                if (videoId == null) {
                    continue;
                }
                YouTubeVideo video = videoMap.get(videoId);
                if (video != null) {
                    saveService.insertLikedVideo(account, video, null, now);
                }
            }

            saveService.insertSnapshot(account, SnapshotType.FULL_SYNC, "{\"status\":\"ok\"}", now);
            saveService.updateSyncStatus(account, SyncStatus.SYNCED, now);

        } catch (Exception e) {
            saveService.updateSyncStatus(account, SyncStatus.FAILED, account.getLastSyncedAt());
            if (e instanceof CustomException) {
                throw e;
            }
            throw new CustomException(ErrorCode.INTERNAL_ERROR, "YouTube 동기화 중 오류가 발생했습니다.", e.getMessage());
        }
    }

    private List<Map<String, Object>> getItems(Map<String, Object> body) {
        if (body == null) {
            return List.of();
        }
        Object items = body.get("items");
        if (items instanceof List) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> list = (List<Map<String, Object>>) items;
            return list;
        }
        return List.of();
    }

    private Map<String, Object> getMap(Object obj) {
        if (obj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) obj;
            return map;
        }
        return Map.of();
    }

    private String extractFirstChannelId(Map<String, Object> body) {
        List<Map<String, Object>> items = getItems(body);
        if (items.isEmpty()) {
            throw new CustomException(ErrorCode.EXTERNAL_API_BAD_RESPONSE, "채널 정보를 찾을 수 없습니다.");
        }
        Object id = items.get(0).get("id");
        if (id == null) {
            throw new CustomException(ErrorCode.EXTERNAL_API_BAD_RESPONSE, "채널 ID가 없습니다.");
        }
        return id.toString();
    }

    private LocalDateTime parseDateTime(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return OffsetDateTime.parse(value.toString()).toLocalDateTime();
        } catch (Exception e) {
            return null;
        }
    }
}