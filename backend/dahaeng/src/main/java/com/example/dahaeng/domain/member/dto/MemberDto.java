package com.example.dahaeng.domain.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MemberDto {
    private Long id;
    private String role;
    private String nickname;
    private String email;
    private String profileImageUrl;
    private String socialId;
}
