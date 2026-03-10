package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class InterestAnalysisResult {
    private final Long accountId;
    private final List<InterestKeywordCandidate> keywords;
    private final Map<InterestCategory, Double> categories;
}