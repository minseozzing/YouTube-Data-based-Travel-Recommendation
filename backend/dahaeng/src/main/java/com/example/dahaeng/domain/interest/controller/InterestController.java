package com.example.dahaeng.domain.interest.controller;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.service.InterestAnalysisService;
import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.example.dahaeng.domain.youtube.entity.YouTubeAccount;
import com.example.dahaeng.domain.youtube.repository.YouTubeAccountRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/interest")
public class InterestController {

    private final InterestAnalysisService analysisService;
    private final MemberRepository memberRepository;
    private final YouTubeAccountRepository accountRepository;

    /**
     * 현재 로그인한 사용자의 유튜브 활동 분석 및 여행 태그 추론 실행
     */
    @PostMapping("/analyze")
    public ResponseEntity<InterestAnalysisResult> analyze(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        // 1. 현재 로그인한 멤버 조회
        Member member = memberRepository.findById(principal.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        // 2. 멤버와 연결된 유튜브 계정 조회
        YouTubeAccount account = accountRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED, "구글 연동 정보가 없습니다."));

        // 3. 분석 실행 (유튜브 계정 ID 사용)
        InterestAnalysisResult result = analysisService.analyze(account.getId());

        return ResponseEntity.ok(result);
    }
}