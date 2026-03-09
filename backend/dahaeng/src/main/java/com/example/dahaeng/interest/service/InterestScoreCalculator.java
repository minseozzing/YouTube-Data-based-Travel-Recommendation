package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.interest.enums.InterestSourceType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterestScoreCalculator {

    private final Map<InterestSourceType, Double> sourceWeightMap;

    public List<InterestKeywordCandidate> score(List<InterestKeywordCandidate> candidates) {
        Map<String, Double> scoreMap = new HashMap<>();
        Map<String, String> rawMap = new HashMap<>();
        Map<String, InterestSourceType> sourceMap = new HashMap<>();

        for (InterestKeywordCandidate c : candidates) {
            String key = c.getNormalizedKeyword();
            if (key == null || key.isBlank()) {
                continue;
            }
            double weight = sourceWeightMap.getOrDefault(c.getSourceType(), 1.0);
            scoreMap.put(key, scoreMap.getOrDefault(key, 0.0) + weight);
            rawMap.putIfAbsent(key, c.getRawKeyword());

            InterestSourceType existing = sourceMap.get(key);
            if (existing == null || sourceWeightMap.getOrDefault(c.getSourceType(), 0.0) > sourceWeightMap.getOrDefault(existing, 0.0)) {
                sourceMap.put(key, c.getSourceType());
            }
        }

        List<InterestKeywordCandidate> result = new ArrayList<>();
        for (Map.Entry<String, Double> e : scoreMap.entrySet()) {
            String key = e.getKey();
            result.add(InterestKeywordCandidate.builder()
                    .rawKeyword(rawMap.get(key))
                    .normalizedKeyword(key)
                    .sourceType(sourceMap.get(key))
                    .score(e.getValue())
                    .build());
        }
        return result;
    }
}