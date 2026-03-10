package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.constant.TravelTagCatalog;
import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TravelTagPromptFactory {

    public String createSystemPrompt() {
        return String.format("""
                당신은 사용자의 관심 키워드를 분석하여 고정된 여행 취향 태그로 변환하는 시맨틱 매핑 전문가입니다.
                
                [미션]
                제공된 키워드를 분석하여 아래 '태그 정의 가이드' 내에서 가장 적합한 태그를 선택하세요.
                
                [태그 정의 가이드 - 반드시 이 목록 내에서만 선택]
                1. Vibe (분위기): 여유로운, 힙한, 로컬감성, 활기찬, 럭셔리한, 조용한, 전통적인
                2. Landscape (풍경): 도시의밤, 푸른바다, 초록대자연, 역사속으로, 눈부신설원, 이국적인
                3. Activity (활동): 미식탐방, 쇼핑중독, 액티비티, 예술과전시, 사진에진심, 배움이있는
                4. Who (동행): 나홀로, 연인과, 친구와, 가족과
                5. Climate (기후): 따뜻한곳, 추운곳, 눈과함께, 사계절, 건조한, 습한, 열대, 온화한
                
                [엄격한 출력 규칙 - 반드시 준수]
                1. **score 필드 값**: 반드시 0.0에서 1.0 사이의 실수로 작성하세요. 
                   **절대로 입력 데이터에 있는 큰 숫자(예: 18.1, 8.2 등)를 그대로 복사하지 마세요.** 
                   입력 키워드와 태그의 연관성을 당신이 판단하여 0과 1 사이로 재계산해야 합니다.
                2. **confidence 필드 값**: 당신의 추론 확신도를 0.0에서 1.0 사이의 실수로 작성하세요.
                3. **category/tag 필드**: 반드시 가이드에 명시된 단어만 사용하세요.
                4. 결과는 반드시 JSON 형식으로 반환하세요.
                
                [응답 예시]
                {
                  "tags": [
                    { "tag": "힙한", "category": "Vibe", "score": 0.92, "confidence": 0.85, "reason": "테슬라, 자율주행 등 최신 기술 트렌드 선호" }
                  ]
                }
                """);
    }

    public String createUserPrompt(List<InterestKeywordCandidate> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return "[]";
        }
        return keywords.stream()
                .map(k -> String.format("{\"raw\":\"%s\",\"norm\":\"%s\",\"score\":%.1f,\"src\":\"%s\"}",
                        escapeJson(k.getRawKeyword()), 
                        escapeJson(k.getNormalizedKeyword()), 
                        k.getTotalScore(),
                        k.getSourceType()))
                .collect(Collectors.joining(",", "[", "]"));
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"");
    }
}
