package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestPhraseNormalizer {

    private final Map<String, String> phraseNormalizationMap;

    /**
     * 복합어 보호 로직: 안전한 정규식 치환을 사용하여 단어 경계를 인식하고 오탐을 줄입니다.
     */
    public List<RawInterestSignal> normalizePhrases(List<RawInterestSignal> signals) {
        if (signals == null || signals.isEmpty()) return signals;

        // 길이가 긴 구절부터 정렬
        List<Map.Entry<String, String>> sortedPhrases = phraseNormalizationMap.entrySet().stream()
                .sorted((e1, e2) -> Integer.compare(e2.getKey().length(), e1.getKey().length()))
                .collect(Collectors.toList());

        List<RawInterestSignal> result = new ArrayList<>();
        for (RawInterestSignal signal : signals) {
            String text = signal.getRawText();
            if (text == null || text.isBlank()) continue;

            String normalized = applySafePhraseProtection(text, sortedPhrases);
            
            result.add(RawInterestSignal.builder()
                    .rawText(normalized)
                    .sourceType(signal.getSourceType())
                    .videoId(signal.getVideoId())
                    .playlistId(signal.getPlaylistId())
                    .build());
        }
        return result;
    }

    /**
     * 정규식 룩비하인드/룩어헤드를 사용하여 단어 경계를 확인하며 치환합니다.
     */
    private String applySafePhraseProtection(String text, List<Map.Entry<String, String>> sortedPhrases) {
        String out = text;
        for (Map.Entry<String, String> entry : sortedPhrases) {
            String target = entry.getKey();
            String replacement = entry.getValue();

            // 문자와 숫자(\p{L}\p{N}) 및 기존 언더스코어가 앞뒤에 없는 경우에만 치환 (단어 경계 보호)
            String regex = "(?<![\\p{L}\\p{N}_])" + Pattern.quote(target) + "(?![\\p{L}\\p{N}_])";
            out = out.replaceAll(regex, replacement);
        }
        return out;
    }
}
