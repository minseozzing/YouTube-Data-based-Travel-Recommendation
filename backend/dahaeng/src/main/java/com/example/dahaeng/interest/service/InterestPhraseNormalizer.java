package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterestPhraseNormalizer {

    private final Map<String, String> phraseNormalizationMap;

    public List<RawInterestSignal> normalizePhrases(List<RawInterestSignal> signals) {
        List<RawInterestSignal> result = new ArrayList<>();
        for (RawInterestSignal signal : signals) {
            String text = signal.getRawText();
            if (text == null || text.isBlank()) {
                continue;
            }
            String normalized = applyPhraseMap(text);
            result.add(RawInterestSignal.builder()
                    .rawText(normalized)
                    .sourceType(signal.getSourceType())
                    .videoId(signal.getVideoId())
                    .playlistId(signal.getPlaylistId())
                    .build());
        }
        return result;
    }

    private String applyPhraseMap(String text) {
        String out = text;
        for (Map.Entry<String, String> entry : phraseNormalizationMap.entrySet()) {
            String from = entry.getKey();
            String to = entry.getValue();
            if (from == null || from.isBlank()) {
                continue;
            }
            out = out.replace(from, to);
        }
        return out;
    }
}
