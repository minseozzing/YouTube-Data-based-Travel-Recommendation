package com.example.dahaeng.auth.jwt;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.auth.dto.MemberDto;
import com.example.dahaeng.auth.entity.Member;
import com.example.dahaeng.auth.repository.MemberRepository;
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

        // 이미 인증된 경우(다른 필터/세션 등) 스킵
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1) Authorization 헤더에서 Bearer 토큰 추출
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
            // 2) 서명/만료/형식 검증
            jwtUtil.validateToken(token);

            // 3) access 토큰인지 확인 (refresh를 들고 와서 인증되는 실수 방지)
            if (!"access".equals(jwtUtil.getCategory(token))) {
                filterChain.doFilter(request, response);
                return;
            }

            // 4) 토큰에서 memberId, role 추출
            Long memberId = jwtUtil.getMemberId(token);
            String role = jwtUtil.getRole(token);

            if (memberId == null || role == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 5) DB에서 사용자 조회 (탈퇴/권한변경/유저 존재 여부 확인)
            //    성능이 걱정되면 최소 정보만 토큰에 싣고 DB 조회를 생략할 수도 있지만,
            //    지금은 안정성이 우선이라 조회 권장.
            Member member = memberRepository.findById(memberId).orElse(null);
            if (member == null) {
                filterChain.doFilter(request, response);
                return;
            }
            if (member.getDeletedAt() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 6) Principal(CustomOAuth2User) 구성
            MemberDto dto = MemberDto.builder()
                    .id(member.getId())
                    .role(role) // 토큰 role 사용(또는 member.getRole()로 강제)
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .profileImageUrl(member.getProfileImageUrl())
                    .socialId(member.getSocialId())
                    .build();

            // attributes는 JWT 기반 요청에서는 의미 없으니 빈 Map으로
            CustomOAuth2User principal = new CustomOAuth2User(dto, Map.of());

            // 7) SecurityContext에 Authentication 세팅
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException | IllegalArgumentException e) {
            // 토큰 위조/만료/형식 오류: 인증 없이 통과 (또는 401로 끊고 싶으면 여기서 처리)
            // 여기서는 "보호 리소스 접근 시" EntryPoint가 401 처리하도록 두는게 보통 깔끔함
        }

        filterChain.doFilter(request, response);
    }
}