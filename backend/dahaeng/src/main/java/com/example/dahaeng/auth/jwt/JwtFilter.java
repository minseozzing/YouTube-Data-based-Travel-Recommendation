package com.example.dahaeng.auth.jwt;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.member.dto.MemberDto;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ?´ë? ?¸ì¦??ê²½ìš°(?¤ë¥¸ ?„í„°/?¸ì…˜ ?? ?¤í‚µ
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1) Authorization ?¤ë”?ì„œ Bearer ? í° ì¶”ì¶œ
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7).trim();
        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 2) ?œëª…/ë§Œë£Œ/?•ì‹ ê²€ì¦?
            jwtUtil.validateToken(token);

            // 3) access ? í°?¸ì? ?•ì¸ (refreshë¥??¤ê³  ?€???¸ì¦?˜ëŠ” ?¤ìˆ˜ ë°©ì?)
            if (!"access".equals(jwtUtil.getCategory(token))) {
                filterChain.doFilter(request, response);
                return;
            }

            // 4) ? í°?ì„œ memberId, role ì¶”ì¶œ
            Long memberId = jwtUtil.getMemberId(token);
            String role = jwtUtil.getRole(token);

            if (memberId == null || role == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 5) DB?ì„œ ?¬ìš©??ì¡°íšŒ (?ˆí‡´/ê¶Œí•œë³€ê²?? ì? ì¡´ì¬ ?¬ë? ?•ì¸)
            //    ?±ëŠ¥??ê±±ì •?˜ë©´ ìµœì†Œ ?•ë³´ë§?? í°???£ê³  DB ì¡°íšŒë¥??ëµ???˜ë„ ?ˆì?ë§?
            //    ì§€ê¸ˆì? ?ˆì •?±ì´ ?°ì„ ?´ë¼ ì¡°íšŒ ê¶Œì¥.
            Member member = memberRepository.findById(memberId).orElse(null);
            if (member == null) {
                filterChain.doFilter(request, response);
                return;
            }
            if (member.getDeletedAt() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 6) Principal(CustomOAuth2User) êµ¬ì„±
            MemberDto dto = MemberDto.builder()
                    .id(member.getId())
                    .role(role) // ? í° role ?¬ìš©(?ëŠ” member.getRole()ë¡?ê°•ì œ)
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .profileImageUrl(member.getProfileImageUrl())
                    .socialId(member.getSocialId())
                    .build();

            // attributes??JWT ê¸°ë°˜ ?”ì²­?ì„œ???˜ë? ?†ìœ¼??ë¹?Map?¼ë¡œ
            CustomOAuth2User principal = new CustomOAuth2User(dto, Map.of());

            // 7) SecurityContext??Authentication ?¸íŒ…
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException | IllegalArgumentException e) {
            // ? í° ?„ì¡°/ë§Œë£Œ/?•ì‹ ?¤ë¥˜: ?¸ì¦ ?†ì´ ?µê³¼ (?ëŠ” 401ë¡??Šê³  ?¶ìœ¼ë©??¬ê¸°??ì²˜ë¦¬)
            // ?¬ê¸°?œëŠ” "ë³´í˜¸ ë¦¬ì†Œ???‘ê·¼ ?? EntryPointê°€ 401 ì²˜ë¦¬?˜ë„ë¡??ëŠ”ê²?ë³´í†µ ê¹”ë”??
        }

        filterChain.doFilter(request, response);
    }
}
