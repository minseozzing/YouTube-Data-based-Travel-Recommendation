package com.example.dahaeng.interest.dto;

import com.example.dahaeng.interest.enums.InterestSourceType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenizedSignal {
    private final String rawToken;
    private final InterestSourceType sourceType;
}