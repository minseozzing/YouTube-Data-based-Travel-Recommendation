package com.example.dahaeng.interest.dto;

import com.example.dahaeng.interest.enums.InterestSourceType;
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