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

        // 이미 인증된 경우(다른 필터/인증 처리 후) 스킵
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

            // 3) access 토큰인지 확인 (refresh로 인증하는 경우 방지)
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

            // 5) DB에서 사용자 조회 (탈퇴/권한변경 등 확인)
            //    성능 이슈가 있으면 최소 정보만 토큰에 담고 DB 조회를 생략할 수도 있음.
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
                    .role(role) // 토큰 role 사용(또는 member.getRole())
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .profileImageUrl(member.getProfileImageUrl())
                    .socialId(member.getSocialId())
                    .build();

            // JWT 기반 요청이므로 attributes는 비어있는 Map
            CustomOAuth2User principal = new CustomOAuth2User(dto, Map.of());

            // 7) SecurityContext에 Authentication 설정
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException | IllegalArgumentException e) {
            // 토큰 위조/만료/형식 오류: 인증 없이 통과 (또는 401 처리)
            // 여기서 401 처리하려면 EntryPoint에서 응답하도록 구성하면 된다.
        }

        filterChain.doFilter(request, response);
    }
}
