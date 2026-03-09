package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class InterestTextCleaner {

    private static final Pattern PREFIX_PATTERN = Pattern.compile("\\b(format|series|source|type|person|location)\\s*:[^\\s]+", Pattern.CASE_INSENSITIVE);

    private final Set<String> stopwords;

    public List<RawInterestSignal> clean(List<RawInterestSignal> signals) {
        List<RawInterestSignal> result = new ArrayList<>();
        for (RawInterestSignal signal : signals) {
            String raw = signal.getRawText();
            if (raw == null || raw.isBlank()) {
                continue;
            }
            String cleaned = PREFIX_PATTERN.matcher(raw).replaceAll(" ");
            cleaned = cleaned.replaceAll("\\s+", " ").trim();
            if (cleaned.isEmpty()) {
                continue;
            }
            result.add(RawInterestSignal.builder()
                    .rawText(cleaned)
                    .sourceType(signal.getSourceType())
                    .videoId(signal.getVideoId())
                    .playlistId(signal.getPlaylistId())
                    .build());
        }
        return result;
    }

    private String removeStopwords(String text) {
        String out = text;
        for (String stopword : stopwords) {
            if (stopword == null || stopword.isBlank()) {
                continue;
            }
            out = out.replaceAll("(?i)\\b" + Pattern.quote(stopword) + "\\b", " ");
        }
        return out;
    }
}
