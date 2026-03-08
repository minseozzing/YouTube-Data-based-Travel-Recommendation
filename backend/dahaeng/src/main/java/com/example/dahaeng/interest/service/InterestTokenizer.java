package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import com.example.dahaeng.interest.dto.TokenizedSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestTokenizer {

    public List<TokenizedSignal> tokenize(List<RawInterestSignal> signals) {
        List<TokenizedSignal> result = new ArrayList<>();
        for (RawInterestSignal signal : signals) {
            String text = signal.getRawText();
            if (text == null || text.isBlank()) {
                continue;
            }
            String[] tokens = text.split("[^\\p{L}\\p{N}]+");
            for (String token : tokens) {
                if (token == null || token.isBlank()) {
                    continue;
                }
                String normalized = token.toLowerCase();
                if (normalized.length() <= 1) {
                    continue;
                }
                if (normalized.chars().allMatch(Character::isDigit)) {
                    continue;
                }
                result.add(TokenizedSignal.builder()
                        .rawToken(normalized)
                        .sourceType(signal.getSourceType())
                        .build());
            }
        }
        return result;
    }
}
