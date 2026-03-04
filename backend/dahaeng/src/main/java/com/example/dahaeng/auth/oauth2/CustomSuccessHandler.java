package com.example.dahaeng.auth.oauth2;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.auth.service.OAuthCodeService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuthCodeService oAuthCodeService;

    // 프론트 콜백 URL (환경변수/프로퍼티로 빼는 걸 추천)
    private static final String FRONT_CALLBACK_URL = "http://localhost:3000/oauth/callback";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User principal = (CustomOAuth2User) authentication.getPrincipal();

        // 1회용 code 발급 (30~60초 만료 권장)
        String code = oAuthCodeService.issueCode(principal);

        // 프론트로 redirect (토큰이 아니라 code만 전달)
        response.sendRedirect(FRONT_CALLBACK_URL + "?code=" + code);
    }
}