package com.example.dahaeng.youtube.service;

import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
import com.example.dahaeng.youtube.dto.YouTubePlaylistDto;
import com.example.dahaeng.youtube.dto.YouTubeSubscriptionDto;
import com.example.dahaeng.youtube.dto.YouTubeVideoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YouTubeService {

    private final MemberRepository memberRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

    /**
     * 사용자 구글 액세스 토큰 가져오기
     */
    private String getAccessToken(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        String token = member.getGoogleAccessToken();
        if (token == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "구글 연동 정보가 없습니다.");
        }
        return token;
    }

    /**
     * 재생목록 조회 (동영상 제목, 카테고리, 채널 포함)
     */
    public List<YouTubePlaylistDto> getPlaylists(Long memberId) {
        String token = getAccessToken(memberId);
        // 1. 재생목록 조회 (본인 소유) - 최대 5개
        String playlistUrl = YOUTUBE_API_BASE_URL + "/playlists?part=snippet&mine=true&maxResults=5";
        ResponseEntity<Map> playlistResponse = callYouTubeApi(playlistUrl, token);
        List<Map<String, Object>> playlists = (List<Map<String, Object>>) playlistResponse.getBody().get("items");

        List<YouTubePlaylistDto> result = new ArrayList<>();
        if (playlists != null) {
            for (Map<String, Object> playlist : playlists) {
                String playlistId = (String) playlist.get("id");
                String playlistTitle = (String) ((Map<String, Object>) playlist.get("snippet")).get("title");

                // 2. 해당 재생목록의 동영상 목록(playlistItems) 조회 - 최대 8개
                String itemsUrl = YOUTUBE_API_BASE_URL + "/playlistItems?part=snippet,contentDetails&playlistId=" + playlistId + "&maxResults=8";
                ResponseEntity<Map> itemsResponse = callYouTubeApi(itemsUrl, token);
                List<Map<String, Object>> items = (List<Map<String, Object>>) itemsResponse.getBody().get("items");

                List<YouTubeVideoDto> videosInPlaylist = new ArrayList<>();
                if (items != null) {
                    for (Map<String, Object> item : items) {
                        Map<String, Object> contentDetails = (Map<String, Object>) item.get("contentDetails");
                        String videoId = (String) contentDetails.get("videoId");

                        // 3. 각 동영상 상세 정보 조회 (videos API)
                        videosInPlaylist.add(getVideoDetails(videoId, token));
                    }
                }

                result.add(YouTubePlaylistDto.builder()
                        .id(playlistId)
                        .title(playlistTitle)
                        .videos(videosInPlaylist)
                        .build());
            }
        }
        return result;
    }

    /**
     * 동영상 상세 정보 조회 (제목, 채널명, 카테고리 ID)
     */
    private YouTubeVideoDto getVideoDetails(String videoId, String token) {
        String url = YOUTUBE_API_BASE_URL + "/videos?part=snippet&id=" + videoId;
        ResponseEntity<Map> response = callYouTubeApi(url, token);
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        if (items != null && !items.isEmpty()) {
            Map<String, Object> snippet = (Map<String, Object>) items.get(0).get("snippet");
            return YouTubeVideoDto.builder()
                    .id(videoId)
                    .title((String) snippet.get("title"))
                    .channelTitle((String) snippet.get("channelTitle"))
                    .categoryId((String) snippet.get("categoryId"))
                    .tags((List<String>) snippet.get("tags")) // 태그 추가
                    .build();
        }
        return YouTubeVideoDto.builder().id(videoId).title("정보 없음").build();
    }

    /**
     * 구독 목록 조회 (최대 10개)
     */
    public List<YouTubeSubscriptionDto> getSubscriptions(Long memberId) {
        String token = getAccessToken(memberId);
        String url = YOUTUBE_API_BASE_URL + "/subscriptions?part=snippet&mine=true&maxResults=10";

        ResponseEntity<Map> response = callYouTubeApi(url, token);
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        List<YouTubeSubscriptionDto> result = new ArrayList<>();
        if (items != null) {
            for (Map<String, Object> item : items) {
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                result.add(YouTubeSubscriptionDto.builder()
                        .id((String) item.get("id"))
                        .title((String) snippet.get("title"))
                        .build());
            }
        }
        return result;
    }

    /**
     * 좋아요한 동영상 조회 (최대 10개)
     */
    public List<YouTubeVideoDto> getLikedVideos(Long memberId) {
        String token = getAccessToken(memberId);
        String url = YOUTUBE_API_BASE_URL + "/videos?part=snippet&myRating=like&maxResults=10";

        ResponseEntity<Map> response = callYouTubeApi(url, token);
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");

        List<YouTubeVideoDto> result = new ArrayList<>();
        if (items != null) {
            for (Map<String, Object> item : items) {
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                result.add(YouTubeVideoDto.builder()
                        .id((String) item.get("id"))
                        .title((String) snippet.get("title"))
                        .channelTitle((String) snippet.get("channelTitle"))
                        .categoryId((String) snippet.get("categoryId"))
                        .tags((List<String>) snippet.get("tags")) // 태그 추가
                        .build());
            }
        }
        return result;
    }

    private ResponseEntity<Map> callYouTubeApi(String url, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            return restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "YouTube API 호출 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
