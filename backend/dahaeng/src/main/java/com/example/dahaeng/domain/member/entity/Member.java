package com.example.dahaeng.domain.member.entity;

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
     * 구글 토큰 정보 업데이트
     */
    public void updateGoogleTokens(String accessToken, String refreshToken, LocalDateTime expiresAt) {
        this.googleAccessToken = accessToken;
        if (refreshToken != null) {
            this.googleRefreshToken = refreshToken;
        }
        this.googleTokenExpiresAt = expiresAt;
    }

    /**
     * 회원 탈퇴 (Soft Delete)
     */
    public void withdraw() {
        this.deletedAt = LocalDateTime.now();
    }
}
