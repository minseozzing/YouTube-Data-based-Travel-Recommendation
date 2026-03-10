package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InterestKeywordCandidate {
    private final String rawKeyword;
    private final String normalizedKeyword;
    private final InterestSourceType sourceType;
    private final double score;
}