package com.example.dahaeng.youtube.service;

import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.youtube.entity.*;
import com.example.dahaeng.youtube.enums.PrivacyStatus;
import com.example.dahaeng.youtube.enums.SnapshotType;
import com.example.dahaeng.youtube.enums.SyncStatus;
import com.example.dahaeng.youtube.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class YouTubeSaveService {

    private final YouTubeAccountRepository accountRepository;
    private final YouTubePlaylistRepository playlistRepository;
    private final YouTubeVideoRepository videoRepository;
    private final YouTubePlaylistVideoRepository playlistVideoRepository;
    private final YouTubeLikedVideoRepository likedVideoRepository;
    private final YouTubeSubscriptionRepository subscriptionRepository;
    private final YouTubeVideoTagRepository videoTagRepository;
    private final YouTubeSyncSnapshotRepository snapshotRepository;

    public YouTubeAccount upsertAccount(Member member, String youtubeChannelId, String googleEmail, String accessToken, String refreshToken) {
        Optional<YouTubeAccount> existing = accountRepository.findByMemberId(member.getId());
        YouTubeAccount account = existing.orElseGet(() -> YouTubeAccount.builder()
                .member(member)
                .youtubeChannelId(youtubeChannelId)
                .googleEmail(googleEmail)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .syncStatus(SyncStatus.PENDING)
                .build());

        if (existing.isPresent()) {
            YouTubeAccount prev = existing.get();
            String channelId = youtubeChannelId != null ? youtubeChannelId : prev.getYoutubeChannelId();
            account = YouTubeAccount.builder()
                    .id(prev.getId())
                    .member(prev.getMember())
                    .youtubeChannelId(channelId)
                    .googleEmail(googleEmail)
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .syncStatus(prev.getSyncStatus())
                    .lastSyncedAt(prev.getLastSyncedAt())
                    .build();
        }

        return accountRepository.save(account);
    }

    public YouTubePlaylist upsertPlaylist(YouTubeAccount account, String youtubePlaylistId, String title, PrivacyStatus privacyStatus, LocalDateTime collectedAt) {
        Optional<YouTubePlaylist> existing = playlistRepository.findByYoutubePlaylistId(youtubePlaylistId);
        YouTubePlaylist playlist = existing.orElseGet(() -> YouTubePlaylist.builder()
                .account(account)
                .youtubePlaylistId(youtubePlaylistId)
                .build());

        playlist = YouTubePlaylist.builder()
                .id(playlist.getId())
                .account(account)
                .youtubePlaylistId(youtubePlaylistId)
                .title(title)
                .privacyStatus(privacyStatus)
                .collectedAt(collectedAt)
                .build();

        return playlistRepository.save(playlist);
    }

    public YouTubeVideo upsertVideo(String youtubeVideoId, String title, String channelTitle, String categoryId) {
        Optional<YouTubeVideo> existing = videoRepository.findByYoutubeVideoId(youtubeVideoId);
        YouTubeVideo video = existing.orElseGet(() -> YouTubeVideo.builder()
                .youtubeVideoId(youtubeVideoId)
                .build());

        video = YouTubeVideo.builder()
                .id(video.getId())
                .youtubeVideoId(youtubeVideoId)
                .title(title)
                .channelTitle(channelTitle)
                .categoryId(categoryId)
                .build();

        return videoRepository.save(video);
    }

    public void insertPlaylistVideo(YouTubePlaylist playlist, YouTubeVideo video, Integer position, LocalDateTime collectedAt) {
        if (playlistVideoRepository.existsByPlaylistIdAndVideoId(playlist.getId(), video.getId())) {
            return;
        }
        YouTubePlaylistVideo pv = YouTubePlaylistVideo.builder()
                .playlist(playlist)
                .video(video)
                .position(position)
                .collectedAt(collectedAt)
                .build();
        playlistVideoRepository.save(pv);
    }

    public void insertLikedVideo(YouTubeAccount account, YouTubeVideo video, LocalDateTime likedAt, LocalDateTime collectedAt) {
        if (likedVideoRepository.existsByAccountIdAndVideoId(account.getId(), video.getId())) {
            return;
        }
        YouTubeLikedVideo lv = YouTubeLikedVideo.builder()
                .account(account)
                .video(video)
                .likedAt(likedAt)
                .collectedAt(collectedAt)
                .build();
        likedVideoRepository.save(lv);
    }

    public YouTubeSubscription upsertSubscription(YouTubeAccount account, String youtubeChannelId, String title, String description, LocalDateTime subscribedAt, LocalDateTime collectedAt) {
        Optional<YouTubeSubscription> existing = subscriptionRepository.findByAccountIdAndYoutubeChannelId(account.getId(), youtubeChannelId);
        YouTubeSubscription sub = existing.orElseGet(() -> YouTubeSubscription.builder()
                .account(account)
                .youtubeChannelId(youtubeChannelId)
                .build());

        sub = YouTubeSubscription.builder()
                .id(sub.getId())
                .account(account)
                .youtubeChannelId(youtubeChannelId)
                .title(title)
                .description(description)
                .subscribedAt(subscribedAt)
                .collectedAt(collectedAt)
                .build();

        return subscriptionRepository.save(sub);
    }

    public void insertVideoTags(YouTubeVideo video, List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return;
        }
        for (String tag : tags) {
            if (tag == null || tag.isBlank()) {
                continue;
            }
            if (videoTagRepository.existsByVideoIdAndTagName(video.getId(), tag)) {
                continue;
            }
            YouTubeVideoTag t = YouTubeVideoTag.builder()
                    .video(video)
                    .tagName(tag)
                    .build();
            videoTagRepository.save(t);
        }
    }

    public void insertSnapshot(YouTubeAccount account, SnapshotType type, String rawJson, LocalDateTime collectedAt) {
        YouTubeSyncSnapshot snapshot = YouTubeSyncSnapshot.builder()
                .account(account)
                .snapshotType(type)
                .rawJson(rawJson)
                .collectedAt(collectedAt)
                .build();
        snapshotRepository.save(snapshot);
    }

    public void updateSyncStatus(YouTubeAccount account, SyncStatus status, LocalDateTime lastSyncedAt) {
        YouTubeAccount updated = YouTubeAccount.builder()
                .id(account.getId())
                .member(account.getMember())
                .youtubeChannelId(account.getYoutubeChannelId())
                .googleEmail(account.getGoogleEmail())
                .accessToken(account.getAccessToken())
                .refreshToken(account.getRefreshToken())
                .syncStatus(status)
                .lastSyncedAt(lastSyncedAt)
                .build();
        accountRepository.save(updated);
    }
}