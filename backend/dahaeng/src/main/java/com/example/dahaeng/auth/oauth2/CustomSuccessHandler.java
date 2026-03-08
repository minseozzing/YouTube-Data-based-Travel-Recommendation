package com.example.dahaeng.auth.oauth2;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.youtube.service.OAuthCodeService;
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

    // ?ÑÎ°†??ÏΩúÎ∞± URL (?òÍ≤ΩÎ≥Ä???ÑÎ°ú?ºÌã∞Î°?ÎπºÎäî Í±?Ï∂îÏ≤ú)
    private static final String FRONT_CALLBACK_URL = "http://localhost:3000/oauth/callback";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User principal = (CustomOAuth2User) authentication.getPrincipal();

        // 1?åÏö© code Î∞úÍ∏â (30~60Ï¥?ÎßåÎ£å Í∂åÏû•)
        String code = oAuthCodeService.issueCode(principal);

        // ?ÑÎ°†?∏Î°ú redirect (?†ÌÅ∞???ÑÎãà??codeÎß??ÑÎã¨)
        response.sendRedirect(FRONT_CALLBACK_URL + "?code=" + code);
    }
}
