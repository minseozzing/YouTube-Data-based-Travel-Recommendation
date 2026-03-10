package com.example.dahaeng.interest.dto;

import com.example.dahaeng.interest.enums.InterestCategory;
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
}
