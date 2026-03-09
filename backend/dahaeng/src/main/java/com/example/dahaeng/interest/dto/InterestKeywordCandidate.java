package com.example.dahaeng.interest.dto;

import com.example.dahaeng.interest.enums.InterestSourceType;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
public class InterestKeywordCandidate {
    private final String rawKeyword;
    private final String normalizedKeyword;
    private final double totalScore;
    private final Set<InterestSourceType> sourceTypes;
    private final int totalCount;
    private final int distinctSourceCount;
    
    // 호환성 유지 (가장 가중치가 높은 SourceType 하나를 대표로 보관)
    private final InterestSourceType sourceType;

    // InterestCategoryMapper 등에서 사용하는 필드
    public double getScore() {
        return totalScore;
    }
}
