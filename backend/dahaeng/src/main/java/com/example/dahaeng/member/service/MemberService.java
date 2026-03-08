package com.example.dahaeng.member.service;

import com.example.dahaeng.auth.dto.UserResponse;
import com.example.dahaeng.member.entity.Member;
import com.example.dahaeng.member.repository.MemberRepository;
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
     * ? ì? ?•ë³´ ì¡°íšŒ (UserResponse ë³€??
     */
    public UserResponse getMemberResponse(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤."));

        return UserResponse.builder()
                .id(member.getId())
                .role(member.getRole())
                .nickname(member.getNickname())
                .profileImageUrl(member.getProfileImageUrl())
                .build();
    }

    /**
     * ?Œì› ?ˆí‡´ (Soft Delete)
     */
    @Transactional
    public void withdraw(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "?¬ìš©?ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤."));

        if (member.getDeletedAt() != null) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "?´ë? ?ˆí‡´???¬ìš©?ì…?ˆë‹¤.");
        }

        member.withdraw();
    }
}
