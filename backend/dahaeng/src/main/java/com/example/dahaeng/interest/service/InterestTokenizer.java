package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import com.example.dahaeng.interest.dto.TokenizedSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class InterestTokenizer {

    private final Set<String> stopwords;

    // 한국어 조사/어미 약식 트리밍 규칙 (소극적 적용)
    private static final List<String> KOREAN_SUFFIXES = List.of(
            "에서", "으로", "은", "는", "이", "가", "을", "를", "에", "의", "도", "와", "과"
    );

    public List<TokenizedSignal> tokenize(List<RawInterestSignal> signals) {
        List<TokenizedSignal> result = new ArrayList<>();
        
        for (RawInterestSignal signal : signals) {
            String text = signal.getRawText();
            if (text == null || text.isBlank()) continue;

            // 특수문자 제거 (언더스코어 보존)
            String cleaned = text.replaceAll("[^\\p{L}\\p{N}_\\s]", " ").toLowerCase();
            String[] tokens = cleaned.split("\\s+");

            for (String token : tokens) {
                if (token.isBlank()) continue;
                
                // 1. 약식 조사 제거 (은/는/이/가 등)
                String trimmed = trimKoreanSuffix(token);

                // 2. 필터링 로직
                if (trimmed.matches("\\d+")) continue; 
                if (stopwords.contains(trimmed)) continue; 
                if (trimmed.length() <= 1) continue; 

                result.add(TokenizedSignal.builder()
                        .rawToken(trimmed)
                        .sourceType(signal.getSourceType())
                        .build());
            }
        }
        return result;
    }

    private String trimKoreanSuffix(String token) {
        // 복합어(언더스코어 포함)는 조사 트리밍 제외
        if (token.contains("_")) return token;

        for (String suffix : KOREAN_SUFFIXES) {
            // 단어 본체가 충분히 길 때만(2글자 이상 남을 때) 조사 제거
            if (token.endsWith(suffix) && token.length() > suffix.length() + 1) {
                return token.substring(0, token.length() - suffix.length());
            }
        }
        return token;
    }
}
