package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.interest.dto.TokenizedSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class InterestKeywordNormalizer {

    private final Map<String, String> synonymMap;

    public List<InterestKeywordCandidate> normalize(List<TokenizedSignal> tokens) {
        List<InterestKeywordCandidate> result = new ArrayList<>();
        for (TokenizedSignal token : tokens) {
            String raw = token.getRawToken();
            if (raw == null || raw.isBlank()) {
                continue;
            }
            String trimmed = raw.trim();
            String key = trimmed.toLowerCase(Locale.ROOT);
            String normalized = synonymMap.getOrDefault(trimmed, synonymMap.getOrDefault(key, trimmed));

            // 키워드 정규화 및 후보 생성 (점수 및 상세 집계는 이후 ScoreCalculator에서 수행됨)
            result.add(InterestKeywordCandidate.builder()
                    .rawKeyword(trimmed)
                    .normalizedKeyword(normalized)
                    .sourceType(token.getSourceType())
                    .sourceTypes(Set.of(token.getSourceType()))
                    .totalScore(0.0)
                    .totalCount(1)
                    .distinctSourceCount(1)
                    .build());
        }
        return result;
    }
}
