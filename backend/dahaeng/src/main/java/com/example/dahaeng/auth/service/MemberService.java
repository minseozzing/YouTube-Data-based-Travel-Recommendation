package com.example.dahaeng.auth.service;

import com.example.dahaeng.auth.dto.UserResponse;
import com.example.dahaeng.auth.entity.Member;
import com.example.dahaeng.auth.repository.MemberRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * 유저 정보 조회 (UserResponse 변환)
     */
    public UserResponse getMemberResponse(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        return UserResponse.builder()
                .id(member.getId())
                .role(member.getRole())
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .build();
    }

    /**
     * 회원 탈퇴 (Soft Delete)
     */
    @Transactional
    public void withdraw(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (member.getDeletedAt() != null) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "이미 탈퇴한 사용자입니다.");
        }

        member.withdraw();
    }
}
