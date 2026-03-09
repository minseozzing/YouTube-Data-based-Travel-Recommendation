package com.example.dahaeng.youtube.entity;

import com.example.dahaeng.global.entity.BaseEntity;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.youtube.enums.SyncStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "youtube_account")
public class YouTubeAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(name = "youtube_channel_id", length = 100, nullable = false, unique = true)
    private String youtubeChannelId;

    @Column(name = "google_email", length = 100)
    private String googleEmail;

    @Column(name = "access_token", length = 255)
    private String accessToken;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status", nullable = false)
    private SyncStatus syncStatus;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;
}