package com.example.dahaeng.auth.service;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.auth.dto.GoogleResponse;
import com.example.dahaeng.auth.dto.OAuth2Response;
import com.example.dahaeng.member.dto.MemberDto;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final com.example.dahaeng.youtube.service.YouTubeSaveService youtubeSaveService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("[CustomOAuth2UserService] attributes: {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response;
        if ("google".equals(registrationId)) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        // 구글 액세스 토큰/만료 정보 추출
        String googleAccessToken = userRequest.getAccessToken().getTokenValue();
        Instant expiresAtInstant = userRequest.getAccessToken().getExpiresAt();
        LocalDateTime expiresAt = LocalDateTime.ofInstant(
                expiresAtInstant != null ? expiresAtInstant : Instant.now().plusSeconds(3600),
                ZoneId.systemDefault()
        );

        String socialId = oAuth2Response.getProvider() + ":" + oAuth2Response.getProviderId();
        String email = oAuth2Response.getEmail();
        String nickname = oAuth2Response.getName();
        String profileImageUrl = oAuth2Response.getProfileImageUrl();

        Member member = memberRepository.findBySocialId(socialId);

        if (member == null) {
            member = Member.builder()
                    .socialId(socialId)
                    .email(email)
                    .nickname(nickname)
                    .profileImageUrl(profileImageUrl)
                    .role("ROLE_USER")
                    .build();
            log.info("[CustomOAuth2UserService] 신규 회원 생성: socialId={}", socialId);
        } else {
            // 기존 회원 프로필 갱신
            member.updateProfile(nickname, profileImageUrl);
            log.info("[CustomOAuth2UserService] 기존 회원 프로필 갱신: socialId={}", socialId);
        }

        member = memberRepository.save(member);

        // YouTubeAccount에 토큰 정보 저장 (Source of Truth)
        // channelId는 최초 연동 시 YouTubeSyncService에서 채우게 되므로 여기서는 null 유지 가능
        youtubeSaveService.upsertAccount(member, null, email, googleAccessToken, null, expiresAt);

        MemberDto memberDto = MemberDto.builder()
                .id(member.getId())
                .role(member.getRole())
                .nickname(member.getNickname())
                .email(member.getEmail())
                .profileImageUrl(member.getProfileImageUrl())
                .socialId(member.getSocialId())
                .build();

        return new CustomOAuth2User(memberDto, oAuth2User.getAttributes());
    }
}
