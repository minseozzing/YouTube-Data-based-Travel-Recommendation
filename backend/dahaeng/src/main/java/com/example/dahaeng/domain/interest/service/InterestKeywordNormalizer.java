package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.dto.TokenizedSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

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

            // 국가/도시/고유명사는 normalized keyword 레벨에서 관리
            result.add(InterestKeywordCandidate.builder()
                    .rawKeyword(trimmed)
                    .normalizedKeyword(normalized)
                    .sourceType(token.getSourceType())
                    .score(0.0)
                    .build());
        }
        return result;
    }
}