package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestAnalysisResult {
    private Long accountId;
    private List<InterestKeywordCandidate> keywords;
    private Map<InterestCategory, Double> categories;
    private List<TravelTagScore> travelTags;
}
