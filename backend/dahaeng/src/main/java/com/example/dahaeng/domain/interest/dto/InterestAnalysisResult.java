package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.*;

import java.util.List;
// [DELETE_START] (아래 1줄 삭제)
import java.util.Map;
// [DELETE_END]

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestAnalysisResult {
    private Long accountId;
    private List<InterestKeywordCandidate> keywords;
    // [DELETE_START] (아래 1줄 삭제)
    private Map<InterestCategory, Double> categories;
    // [DELETE_END]
    private List<TravelTagScore> travelTags;
}
