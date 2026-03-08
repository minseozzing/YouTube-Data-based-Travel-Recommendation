package com.example.dahaeng.auth.controller;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.youtube.dto.ExchangeRequest;
import com.example.dahaeng.youtube.dto.ExchangeResponse;
import com.example.dahaeng.member.dto.MemberDto;
import com.example.dahaeng.auth.dto.UserResponse;
import com.example.dahaeng.auth.jwt.JwtUtil;
import com.example.dahaeng.member.service.MemberService;
import com.example.dahaeng.youtube.service.OAuthCodeService;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final OAuthCodeService codeService;
    private final MemberService memberService;

    /**
     * ?ÑÎ°†?∏Ïóê????URLÎ°?window.location.href ?¥Îèô?úÌÇ§Î©?
     * Spring SecurityÍ∞Ä Google OAuth2 Î°úÍ∑∏???åÎ°ú?∞Î? ?úÏûë?úÎã§.
     */
    @GetMapping("/google/login-url")
    public ResponseEntity<?> googleLoginUrl() {
        return ResponseEntity.ok(Map.of(
                "loginUrl", "/oauth2/authorization/google"
        ));
    }

    /**
     * OAuth2 ?±Í≥µ ???ÑÎ°†?∏Í? redirectÎ°?Î∞õÏ? codeÎ•?
     * accessToken?ºÎ°ú ÍµêÌôò?òÎäî ?îÎìú?¨Ïù∏??
     */
    @PostMapping("/exchange")
    public ResponseEntity<?> exchange(@RequestBody ExchangeRequest request) {

        OAuthCodeService.Entry entry = codeService.consume(request.getCode());

        String accessToken = jwtUtil.createAccessToken(entry.memberId(), entry.role());

        // ?ÑÏ≤¥ ?†Ï? ?ïÎ≥¥Î•?Ï°∞Ìöå?òÏó¨ ?ëÎãµ???¨Ìï®
        UserResponse memberResponse = memberService.getMemberResponse(entry.memberId());

        return ResponseEntity.ok(ExchangeResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .member(memberResponse)
                .build());
    }

    /**
     * ?ÑÏû¨ Î°úÍ∑∏???†Ï? ?ïÎ≥¥.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            throw new CustomException(ErrorCode.LOGIN_REQUIRED);
        }

        MemberDto dto = principal.getMemberDto();
        return ResponseEntity.ok(UserResponse.builder()
                .id(dto.getId())
                .role(dto.getRole())
                .nickname(dto.getNickname())
                .profileImageUrl(dto.getProfileImageUrl())
                .build());
    }

    /**
     * ?åÏõê ?àÌá¥ (Soft Delete)
     */
    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdraw(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            throw new CustomException(ErrorCode.LOGIN_REQUIRED);
        }

        memberService.withdraw(principal.getId());
        return ResponseEntity.ok(Map.of("message", "successfully withdrawn"));
    }
}
