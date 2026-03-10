package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenizedSignal {
    private final String rawToken;
    private final InterestSourceType sourceType;
}