package com.example.dahaeng.member.entity;

import com.example.dahaeng.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "social_id", length = 50, nullable = false)
    private String socialId;

    @Column(columnDefinition = "TEXT")
    private String profileImageUrl;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 50, nullable = false)
    private String nickname;

    @Column(length = 20, nullable = false)
    private String role;

    @Column(name = "google_access_token", columnDefinition = "TEXT")
    private String googleAccessToken;

    @Column(name = "google_refresh_token", columnDefinition = "TEXT")
    private String googleRefreshToken;

    @Column(name = "google_token_expires_at")
    private LocalDateTime googleTokenExpiresAt;

    public void updateProfile(String nickname, String profileImageUrl) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    /**
     * Íµ¨Í? ?†ÌÅ∞ ?ïÎ≥¥ ?ÖÎç∞?¥Ìä∏
     */
    public void updateGoogleTokens(String accessToken, String refreshToken, LocalDateTime expiresAt) {
        this.googleAccessToken = accessToken;
        if (refreshToken != null) {
            this.googleRefreshToken = refreshToken;
        }
        this.googleTokenExpiresAt = expiresAt;
    }

    /**
     * ?åÏõê ?àÌá¥ (Soft Delete)
     */
    public void withdraw() {
        this.deletedAt = java.time.LocalDateTime.now();
    }
}
