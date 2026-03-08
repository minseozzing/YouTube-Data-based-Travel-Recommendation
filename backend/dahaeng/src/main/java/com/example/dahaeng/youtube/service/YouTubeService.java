package com.example.dahaeng.youtube.service;

import com.example.dahaeng.youtube.dto.YouTubePlaylistDto;
import com.example.dahaeng.youtube.dto.YouTubeSubscriptionDto;
import com.example.dahaeng.youtube.dto.YouTubeVideoDto;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
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
     * ?¬ìš©?ì˜ êµ¬ê? ?¡ì„¸??? í° ê°€?¸ì˜¤ê¸?
     */
    private String getAccessToken(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));
        
        String token = member.getGoogleAccessToken();
        if (token == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "êµ¬ê? ?°ë™ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.");
        }
        return token;
    }

    /**
     * ?¬ìƒëª©ë¡ ì¡°íšŒ (?ìƒ ?œëª©, ì¹´í…Œê³ ë¦¬, ì±„ë„ ?¬í•¨)
     */
    public List<YouTubePlaylistDto> getPlaylists(Long memberId) {
        String token = getAccessToken(memberId);
        // 1. ?¬ìƒëª©ë¡ ëª©ë¡ ì¡°íšŒ (???Œìœ ) - ìµœë? 5ê°?
        String playlistUrl = YOUTUBE_API_BASE_URL + "/playlists?part=snippet&mine=true&maxResults=5";
        ResponseEntity<Map> playlistResponse = callYouTubeApi(playlistUrl, token);
        List<Map<String, Object>> playlists = (List<Map<String, Object>>) playlistResponse.getBody().get("items");

        List<YouTubePlaylistDto> result = new ArrayList<>();
        if (playlists != null) {
            for (Map<String, Object> playlist : playlists) {
                String playlistId = (String) playlist.get("id");
                String playlistTitle = (String) ((Map<String, Object>) playlist.get("snippet")).get("title");

                // 2. ?´ë‹¹ ?¬ìƒëª©ë¡ ?ˆì˜ ?ìƒ ëª©ë¡(playlistItems) ì¡°íšŒ - ìµœë? 8ê°?
                String itemsUrl = YOUTUBE_API_BASE_URL + "/playlistItems?part=snippet,contentDetails&playlistId=" + playlistId + "&maxResults=8";
                ResponseEntity<Map> itemsResponse = callYouTubeApi(itemsUrl, token);
                List<Map<String, Object>> items = (List<Map<String, Object>>) itemsResponse.getBody().get("items");

                List<YouTubeVideoDto> videosInPlaylist = new ArrayList<>();
                if (items != null) {
                    for (Map<String, Object> item : items) {
                        Map<String, Object> contentDetails = (Map<String, Object>) item.get("contentDetails");
                        String videoId = (String) contentDetails.get("videoId");

                        // 3. ê°œë³„ ?ìƒ???ì„¸ ?•ë³´ë¥?ê°€?¸ì˜¤ê¸??„í•´ videos API ?¸ì¶œ
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
     * ?ìƒ ?ì„¸ ?•ë³´ ì¡°íšŒ (?œëª©, ì±„ë„ëª? ì¹´í…Œê³ ë¦¬ID)
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
                    .tags((List<String>) snippet.get("tags")) // ?œê·¸ ì¶”ê?
                    .build();
        }
        return YouTubeVideoDto.builder().id(videoId).title("?????†ìŒ").build();
    }

    /**
     * êµ¬ë…ëª©ë¡ ì¡°íšŒ (ìµœë? 10ê°?
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
     * ì¢‹ì•„?”í•œ ?™ì˜??ì¡°íšŒ (ìµœë? 10ê°?
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
                        .tags((List<String>) snippet.get("tags")) // ?œê·¸ ì¶”ê?
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
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "YouTube API ?¸ì¶œ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: " + e.getMessage());
        }
    }
}
