package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.RawInterestSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class InterestTextCleaner {

    // 1. URL 패턴 (http, https)
    private static final String URL_REGEX = "https?://\\S+\\b";
    // 2. 이메일 패턴
    private static final String EMAIL_REGEX = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    // 3. 한글 자모 패턴 ([ㄱ-ㅎㅏ-ㅣ]) - 'ㅇㅇ', 'ㅋㅋ' 등 제거
    private static final String JAMO_REGEX = "[ㄱ-ㅎㅏ-ㅣ]+";
    // 4. 특수문자 및 이모지 제거 (문자, 숫자, 공백 제외 모두 공백으로 변환)
    // # 도 여기서 공백으로 변환되어, #태그 -> 태그 형태로 텍스트만 보존됨
    private static final String SPECIAL_CHAR_REGEX = "[^\\p{L}\\p{N}\\s]";

    /**
     * 유튜브 원시 텍스트에서 노이즈(URL, 이모지, 특수문자, 자모음)를 제거합니다.
     */
    public List<RawInterestSignal> clean(List<RawInterestSignal> signals) {
        List<RawInterestSignal> result = new ArrayList<>();
        
        for (RawInterestSignal signal : signals) {
            String raw = signal.getRawText();
            if (raw == null || raw.isBlank()) {
                continue;
            }

            // 정규식을 통한 단계적 정제
            String cleaned = raw.replaceAll(URL_REGEX, " ")
                              .replaceAll(EMAIL_REGEX, " ")
                              .replaceAll(JAMO_REGEX, " ")
                              .replaceAll(SPECIAL_CHAR_REGEX, " ")
                              .replaceAll("\\s+", " ") // 중복 공백 제거
                              .trim();

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
}
