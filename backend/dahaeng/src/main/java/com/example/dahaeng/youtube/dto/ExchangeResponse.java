package com.example.dahaeng.youtube.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeResponse {
    private String tokenType;
    private String accessToken;
    private UserResponse member;
}
