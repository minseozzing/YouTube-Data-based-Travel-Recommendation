package com.example.dahaeng.youtube.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeSubscriptionDto {
    private String id;
    private String title; // 구독 채널명
}
