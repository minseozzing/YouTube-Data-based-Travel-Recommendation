package com.example.dahaeng.youtube.service;

import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class YouTubeFetchService {

    private static final String YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public YouTubeApiResponse fetchPlaylists(String accessToken) {
        String url = YOUTUBE_API_BASE_URL + "/playlists?part=snippet,status&mine=true&maxResults=50";
        return callYouTubeApi(url, accessToken);
    }

    public YouTubeApiResponse fetchPlaylistItems(String accessToken, String playlistId) {
        String url = YOUTUBE_API_BASE_URL + "/playlistItems?part=snippet,contentDetails&playlistId=" + playlistId + "&maxResults=50";
        return callYouTubeApi(url, accessToken);
    }

    public YouTubeApiResponse fetchSubscriptions(String accessToken) {
        String url = YOUTUBE_API_BASE_URL + "/subscriptions?part=snippet&mine=true&maxResults=50";
        return callYouTubeApi(url, accessToken);
    }

    public YouTubeApiResponse fetchLikedVideos(String accessToken) {
        String url = YOUTUBE_API_BASE_URL + "/videos?part=snippet&myRating=like&maxResults=50";
        return callYouTubeApi(url, accessToken);
    }

    public YouTubeApiResponse fetchVideoDetails(String accessToken, String videoId) {
        String url = YOUTUBE_API_BASE_URL + "/videos?part=snippet&id=" + videoId;
        return callYouTubeApi(url, accessToken);
    }

    public YouTubeApiResponse fetchMyChannel(String accessToken) {
        String url = YOUTUBE_API_BASE_URL + "/channels?part=id,snippet&mine=true";
        return callYouTubeApi(url, accessToken);
    }

    private YouTubeApiResponse callYouTubeApi(String url, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> body = response.getBody();
            String rawJson = toJson(body);
            return new YouTubeApiResponse(body, rawJson);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR, "YouTube API 호출 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    private String toJson(Map<String, Object> body) {
        if (body == null) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    public record YouTubeApiResponse(Map<String, Object> body, String rawJson) {}
}