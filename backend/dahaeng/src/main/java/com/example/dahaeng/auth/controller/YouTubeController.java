package com.example.dahaeng.auth.controller;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.auth.dto.YouTubePlaylistDto;
import com.example.dahaeng.auth.dto.YouTubeSubscriptionDto;
import com.example.dahaeng.auth.dto.YouTubeVideoDto;
import com.example.dahaeng.auth.service.YouTubeService;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/youtube")
public class YouTubeController {

    private final YouTubeService youtubeService;

    @GetMapping("/playlists")
    public ResponseEntity<?> getPlaylists(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);
        
        List<YouTubePlaylistDto> playlists = youtubeService.getPlaylists(principal.getId());
        return ResponseEntity.ok(Map.of("playlists", playlists));
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubscriptions(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);

        List<YouTubeSubscriptionDto> subscriptions = youtubeService.getSubscriptions(principal.getId());
        return ResponseEntity.ok(Map.of("subscriptions", subscriptions));
    }

    @GetMapping("/liked-videos")
    public ResponseEntity<?> getLikedVideos(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);

        List<YouTubeVideoDto> videos = youtubeService.getLikedVideos(principal.getId());
        return ResponseEntity.ok(Map.of("likedVideos", videos));
    }
}
