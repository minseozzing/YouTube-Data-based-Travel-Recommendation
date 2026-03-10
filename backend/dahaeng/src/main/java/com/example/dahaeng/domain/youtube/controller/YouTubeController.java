package com.example.dahaeng.youtube.controller;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.youtube.dto.YouTubePlaylistDto;
import com.example.dahaeng.youtube.dto.YouTubeSubscriptionDto;
import com.example.dahaeng.youtube.dto.YouTubeVideoDto;
import com.example.dahaeng.youtube.service.YouTubeQueryService;
import com.example.dahaeng.youtube.service.YouTubeSyncService;
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
        return ResponseEntity.ok(Map.of(
                "connected", status.connected(),
                "syncStatus", status.syncStatus(),
                "lastSyncedAt", status.lastSyncedAt()
        ));
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