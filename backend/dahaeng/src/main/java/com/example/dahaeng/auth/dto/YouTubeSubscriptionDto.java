package com.example.dahaeng.auth.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeSubscriptionDto {
    private String id;
    private String title; // 구독한 채널명
}
