package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TravelTagPromptFactory {

    private final TravelTagProvider tagProvider;

    public String createSystemPrompt() {
        return String.format("""
                당신은 사용자의 관심 키워드를 분석하여 고정된 여행 취향 태그로 변환하는 시맨틱 매핑 전문가입니다.
                
                [절대 규칙 - 위반 시 시스템 오류]
                1. 'tag' 필드에는 반드시 아래 제공된 '허용 태그 목록'에 있는 단어만 사용하세요.
                2. 'Japan', 'Osaka', 'Seoul' 같은 지명이나 '레시피', '노래' 같은 일반 단어를 태그로 사용하는 것을 절대 금지합니다.
                3. 지명이 나오면 그 지역의 성향을 해석하여 태그로 매핑하세요. (예: '오사카' -> Vibe: '로컬감성' 또는 '활기찬')
                
                [허용 태그 목록 - 이 중에서만 선택]
                %%s
                
                [매핑 가이드]
                - 특정 국가/도시 여행 키워드 -> Landscape: '이국적인', Vibe: '로컬감성'
                - 맛집, 레시피, 카페 키워드 -> Activity: '미식탐방'
                - 노래, 가사, 버튜버 키워드 -> Activity: '예술과전시', Vibe: '여유로운'
                - 기술, 테슬라, 개발 키워드 -> Vibe: '힙한', Landscape: '도시의밤'
                
                [출력 규칙]
                - score(연관도)와 confidence(확신도)는 반드시 0.0 ~ 1.0 사이의 실수로 작성하세요.
                - 결과는 반드시 JSON 형식으로 반환하세요.
                """).replace("%%s", tagProvider.getAllowedTagsPrompt());
    }

    public String createUserPrompt(List<InterestKeywordCandidate> keywords) {
        if (keywords == null || keywords.isEmpty()) return "[]";

        String jsonData = keywords.stream()
                .map(k -> String.format(
                    "{\"k\":\"%s\",\"s\":%.2f,\"c\":%.2f,\"r\":%.2f}",
                    escape(k.getNormalizedKeyword()),
                    k.getScore(),
                    k.getConfidence(),
                    k.getTravelRelevance()
                ))
                .collect(Collectors.joining(",", "{\"top_keywords\":[", "]}"));

        return "분석 데이터:\n" + jsonData;
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"");
    }
}
