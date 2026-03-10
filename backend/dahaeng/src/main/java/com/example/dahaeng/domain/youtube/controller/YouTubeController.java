package com.example.dahaeng.domain.youtube.controller;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.domain.youtube.dto.YouTubePlaylistDto;
import com.example.dahaeng.domain.youtube.dto.YouTubeSubscriptionDto;
import com.example.dahaeng.domain.youtube.dto.YouTubeVideoDto;
import com.example.dahaeng.domain.youtube.service.YouTubeQueryService;
import com.example.dahaeng.domain.youtube.service.YouTubeSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/youtube")
public class YouTubeController {

    private final YouTubeSyncService syncService;
    private final YouTubeQueryService queryService;

    @PostMapping("/sync")
    public ResponseEntity<?> sync(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);
        syncService.sync(principal);
        return ResponseEntity.ok(Map.of("message", "youtube sync completed"));
    }

    @GetMapping("/sync-status")
    public ResponseEntity<?> getSyncStatus(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);
        var status = queryService.getSyncStatus(principal.getId());
        
        // Map.of는 null 값을 허용하지 않으므로 HashMap을 사용하거나 null 체크를 해야 함
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("connected", status.connected());
        response.put("syncStatus", status.syncStatus() != null ? status.syncStatus() : "NOT_CONNECTED");
        response.put("lastSyncedAt", status.lastSyncedAt());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/playlists")
    public ResponseEntity<?> getPlaylists(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);

        List<YouTubePlaylistDto> playlists = queryService.getPlaylists(principal.getId());
        return ResponseEntity.ok(Map.of("playlists", playlists));
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubscriptions(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);

        List<YouTubeSubscriptionDto> subscriptions = queryService.getSubscriptions(principal.getId());
        return ResponseEntity.ok(Map.of("subscriptions", subscriptions));
    }

    @GetMapping("/liked-videos")
    public ResponseEntity<?> getLikedVideos(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) throw new CustomException(ErrorCode.LOGIN_REQUIRED);

        List<YouTubeVideoDto> videos = queryService.getLikedVideos(principal.getId());
        return ResponseEntity.ok(Map.of("likedVideos", videos));
    }
}