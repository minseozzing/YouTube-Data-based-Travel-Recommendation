package com.example.dahaeng.auth.service;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.auth.dto.GoogleResponse;
import com.example.dahaeng.auth.dto.MemberDto;
import com.example.dahaeng.auth.dto.OAuth2Response;
import com.example.dahaeng.auth.entity.Member;
import com.example.dahaeng.auth.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

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

            memberRepository.save(member);
            log.info("[CustomOAuth2UserService] 신규 회원 생성: socialId={}", socialId);
        } else {
            // 로그인 때마다 최신 프로필로 동기화 (원치 않으면 조건 걸어도 됨)
            member.updateProfile(nickname, profileImageUrl);
            // save 호출 안 해도 @Transactional + dirty checking으로 반영됨
            log.info("[CustomOAuth2UserService] 기존 회원 프로필 갱신: socialId={}", socialId);
        }

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
