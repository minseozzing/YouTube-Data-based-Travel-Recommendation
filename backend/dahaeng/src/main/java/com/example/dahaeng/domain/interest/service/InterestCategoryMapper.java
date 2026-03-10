package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterestCategoryMapper {

    private final Map<String, InterestCategory> categoryMap;

    public Map<InterestCategory, Double> map(List<InterestKeywordCandidate> keywords) {
        Map<InterestCategory, Double> scores = new HashMap<>();

        for (InterestKeywordCandidate k : keywords) {
            String key = k.getNormalizedKeyword();
            if (key == null || key.isBlank()) {
                continue;
            }
            InterestCategory category = categoryMap.get(key);
            if (category == null) {
                continue;
            }
            // TODO: 추후 다중 카테고리 매핑 확장 가능하도록 구조 유지
            scores.put(category, scores.getOrDefault(category, 0.0) + k.getScore());
        }
        return scores;
    }
}