package com.example.dahaeng.domain.youtube.service;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.youtube.dto.response.YouTubeChannelResponse;
import com.example.dahaeng.domain.youtube.dto.response.YouTubePlaylistItemResponse;
import com.example.dahaeng.domain.youtube.dto.response.YouTubePlaylistResponse;
import com.example.dahaeng.domain.youtube.dto.response.YouTubeSubscriptionResponse;
import com.example.dahaeng.domain.youtube.dto.response.YouTubeVideoResponse;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.example.dahaeng.domain.youtube.dto.response.*;
import com.example.dahaeng.domain.youtube.entity.YouTubeAccount;
import com.example.dahaeng.domain.youtube.entity.YouTubePlaylist;
import com.example.dahaeng.domain.youtube.entity.YouTubeVideo;
import com.example.dahaeng.domain.youtube.enums.PrivacyStatus;
import com.example.dahaeng.domain.youtube.enums.SnapshotType;
import com.example.dahaeng.domain.youtube.enums.SyncStatus;
import com.example.dahaeng.domain.youtube.service.YouTubeFetchService.YouTubeApiResponse;
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
        Member member = getAuthenticatedMember(principal);
        String accessToken = getValidAccessToken(member);
        LocalDateTime now = LocalDateTime.now();

        YouTubeAccount account = setupAccount(member, accessToken);

        try {
            saveService.updateSyncStatus(account, SyncStatus.PENDING, account.getLastSyncedAt());

            // 1. 재생목록 동기화
            Map<String, YouTubePlaylist> playlistMap = syncPlaylists(account, accessToken, now);

            // 2. 재생목록 내 비디오 정보 수집
            Set<String> videoIds = new HashSet<>();
            Map<String, List<RawPlaylistItem>> playlistItemsMap = collectPlaylistItems(account, accessToken, playlistMap.keySet(), videoIds, now);

            // 3. 구독 정보 동기화
            syncSubscriptions(account, accessToken, now);

            // 4. 좋아요 표시한 동영상 ID 수집
            List<String> likedVideoIds = collectLikedVideoIds(account, accessToken, videoIds, now);

            // 5. 수집된 모든 비디오의 상세 정보(제목, 태그 등) 동기화
            Map<String, YouTubeVideo> videoMap = syncVideoDetails(accessToken, videoIds, now);

            // 6. 비디오 간의 관계(재생목록-비디오, 좋아요-비디오) 최종 연결
            finalizeRelations(account, playlistMap, playlistItemsMap, videoMap, likedVideoIds, now);

            saveService.replaceSnapshot(account, SnapshotType.FULL_SYNC, "{\"status\":\"ok\"}", now);
            saveService.updateSyncStatus(account, SyncStatus.SYNCED, now);

        } catch (Exception e) {
            saveService.updateSyncStatus(account, SyncStatus.FAILED, account.getLastSyncedAt());
            if (e instanceof CustomException) throw e;
            throw new CustomException(ErrorCode.INTERNAL_ERROR, "YouTube 동기화 중 오류가 발생했습니다.", e.getMessage());
        }
    }

    private Member getAuthenticatedMember(CustomOAuth2User principal) {
        return memberRepository.findById(principal.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    private String getValidAccessToken(Member member) {
        String token = member.getGoogleAccessToken();
        if (token == null || token.isBlank()) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "구글 연동 정보가 없습니다.");
        }
        return token;
    }

    private YouTubeAccount setupAccount(Member member, String accessToken) {
        YouTubeApiResponse<YouTubeChannelResponse> channelResp = fetchService.fetchMyChannel(accessToken);
        if (channelResp.getBody().getItems().isEmpty()) {
            throw new CustomException(ErrorCode.EXTERNAL_API_BAD_RESPONSE, "채널 정보를 찾을 수 없습니다.");
        }
        String channelId = channelResp.getBody().getItems().get(0).getId();
        return saveService.upsertAccount(member, channelId, member.getEmail(), accessToken, member.getGoogleRefreshToken());
    }

    private Map<String, YouTubePlaylist> syncPlaylists(YouTubeAccount account, String accessToken, LocalDateTime now) {
        YouTubeApiResponse<YouTubePlaylistResponse> playlistsResp = fetchService.fetchPlaylists(accessToken);
        saveService.replaceSnapshot(account, SnapshotType.PLAYLISTS, playlistsResp.getRawJson(), now);

        Map<String, YouTubePlaylist> playlistMap = new HashMap<>();
        Set<String> latestPlaylistIds = new HashSet<>();

        for (YouTubePlaylistResponse.PlaylistItem plItem : playlistsResp.getBody().getItems()) {
            String playlistId = plItem.getId();
            YouTubePlaylist saved = saveService.upsertPlaylist(
                    account,
                    playlistId,
                    plItem.getSnippet().getTitle(),
                    PrivacyStatus.valueOf(plItem.getStatus().getPrivacyStatus().toUpperCase()),
                    now
            );
            playlistMap.put(playlistId, saved);
            latestPlaylistIds.add(playlistId);
        }
        saveService.deleteStalePlaylists(account, latestPlaylistIds);
        return playlistMap;
    }

    private Map<String, List<RawPlaylistItem>> collectPlaylistItems(YouTubeAccount account, String accessToken, Set<String> playlistIds, Set<String> videoIds, LocalDateTime now) {
        Map<String, List<RawPlaylistItem>> playlistItemsByPlaylist = new HashMap<>();
        for (String playlistId : playlistIds) {
            YouTubeApiResponse<YouTubePlaylistItemResponse> itemsResp = fetchService.fetchPlaylistItems(accessToken, playlistId);
            saveService.replaceSnapshot(account, SnapshotType.PLAYLIST_ITEMS, itemsResp.getRawJson(), now);

            List<RawPlaylistItem> rawItems = new ArrayList<>();
            for (YouTubePlaylistItemResponse.PlaylistItem item : itemsResp.getBody().getItems()) {
                String videoId = item.getContentDetails().getVideoId();
                rawItems.add(new RawPlaylistItem(videoId, item.getSnippet().getPosition()));
                videoIds.add(videoId);
            }
            playlistItemsByPlaylist.put(playlistId, rawItems);
        }
        return playlistItemsByPlaylist;
    }

    private void syncSubscriptions(YouTubeAccount account, String accessToken, LocalDateTime now) {
        YouTubeApiResponse<YouTubeSubscriptionResponse> subscriptionsResp = fetchService.fetchSubscriptions(accessToken);
        saveService.replaceSnapshot(account, SnapshotType.SUBSCRIPTIONS, subscriptionsResp.getRawJson(), now);

        List<YouTubeSaveService.SubscriptionInput> inputs = new ArrayList<>();
        for (YouTubeSubscriptionResponse.SubscriptionItem subItem : subscriptionsResp.getBody().getItems()) {
            YouTubeSubscriptionResponse.Snippet s = subItem.getSnippet();
            inputs.add(new YouTubeSaveService.SubscriptionInput(
                    s.getResourceId().getChannelId(),
                    s.getTitle(),
                    s.getDescription(),
                    parseDateTime(s.getPublishedAt())
            ));
        }
        saveService.replaceSubscriptions(account, inputs, now);
    }

    private List<String> collectLikedVideoIds(YouTubeAccount account, String accessToken, Set<String> videoIds, LocalDateTime now) {
        YouTubeApiResponse<YouTubeVideoResponse> likedResp = fetchService.fetchLikedVideos(accessToken);
        saveService.replaceSnapshot(account, SnapshotType.LIKED_VIDEOS, likedResp.getRawJson(), now);

        List<String> likedVideoIds = new ArrayList<>();
        for (YouTubeVideoResponse.VideoItem item : likedResp.getBody().getItems()) {
            likedVideoIds.add(item.getId());
            videoIds.add(item.getId());
        }
        return likedVideoIds;
    }

    private Map<String, YouTubeVideo> syncVideoDetails(String accessToken, Set<String> videoIds, LocalDateTime now) {
        Map<String, YouTubeVideo> videoMap = new HashMap<>();
        for (String videoId : videoIds) {
            YouTubeApiResponse<YouTubeVideoResponse> videoResp = fetchService.fetchVideoDetails(accessToken, videoId);
            // Snapshot 저장은 생략 가능하거나 필요시 유지 (현재는 유지)
            // saveService.replaceSnapshot(account, SnapshotType.VIDEO_DETAILS, videoResp.getRawJson(), now);

            if (videoResp.getBody().getItems().isEmpty()) continue;

            YouTubeVideoResponse.VideoItem item = videoResp.getBody().getItems().get(0);
            YouTubeVideoResponse.Snippet s = item.getSnippet();

            YouTubeVideo saved = saveService.upsertVideo(videoId, s.getTitle(), s.getChannelTitle(), s.getCategoryId());
            saveService.replaceVideoTags(saved, s.getTags());
            videoMap.put(videoId, saved);
        }
        return videoMap;
    }

    private void finalizeRelations(YouTubeAccount account, 
                                   Map<String, YouTubePlaylist> playlistMap, 
                                   Map<String, List<RawPlaylistItem>> playlistItemsMap, 
                                   Map<String, YouTubeVideo> videoMap, 
                                   List<String> likedVideoIds, 
                                   LocalDateTime now) {
        // 재생목록-비디오 연결
        for (Map.Entry<String, List<RawPlaylistItem>> entry : playlistItemsMap.entrySet()) {
            YouTubePlaylist playlist = playlistMap.get(entry.getKey());
            List<YouTubeSaveService.PlaylistVideoInput> inputs = new ArrayList<>();
            for (RawPlaylistItem item : entry.getValue()) {
                YouTubeVideo video = videoMap.get(item.videoId());
                if (video != null) inputs.add(new YouTubeSaveService.PlaylistVideoInput(video, item.position()));
            }
            saveService.replacePlaylistVideos(playlist, inputs, now);
        }

        // 좋아요-비디오 연결
        List<YouTubeVideo> likedVideoEntities = new ArrayList<>();
        for (String videoId : likedVideoIds) {
            YouTubeVideo video = videoMap.get(videoId);
            if (video != null) likedVideoEntities.add(video);
        }
        saveService.replaceLikedVideos(account, likedVideoEntities, now);
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null) return null;
        try {
            return OffsetDateTime.parse(value).toLocalDateTime();
        } catch (Exception e) {
            return null;
        }
    }

    private record RawPlaylistItem(String videoId, Integer position) {}
}