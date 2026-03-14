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
                당신은 사용자의 관심 키워드를 고정된 여행 취향 태그로 분류하는 분류 엔진입니다.
                당신의 임무는 새로운 태그를 생성하는 것이 아니라, 오직 제공된 허용 태그 목록 안에서만 적절한 태그를 선택하는 것입니다.

                [최우선 규칙]
                1. category 값은 반드시 다음 중 하나만 사용하세요:
                   - Vibe
                   - Landscape
                   - Activity
                   - Who
                   - Climate

                2. tag 값은 반드시 아래 [허용 태그 목록]에 있는 값만 사용하세요.
                3. 허용 태그 목록에 없는 단어를 tag로 생성하는 것을 절대 금지합니다.
                4. 입력 키워드(예: 오사카, 서울, 일본, 테슬라, 버튜버, 레시피)를 tag로 그대로 출력하는 것을 절대 금지합니다.
                5. 지명, 일반명사, 브랜드명, 장르명은 여행 취향의 의미로 해석해야 하며, 단어 자체를 tag로 출력하면 안 됩니다.
                6. 적절한 태그가 없으면 억지로 생성하지 말고 제외하세요.
                7. 예시처럼 보이는 단어를 기계적으로 반복하지 말고, 반드시 입력 데이터 전체의 의미를 종합하여 분류하세요.
                8. 허용 태그 목록 밖의 값이 하나라도 나오면 잘못된 응답입니다.

                [허용 태그 목록]
                %s

                [분류 원칙]
                - 입력은 사용자의 상위 관심 키워드 목록입니다.
                - 각 키워드는 score, confidence, travelRelevance 값을 가집니다.
                - travelRelevance가 높을수록 여행 취향과 관련 있을 가능성이 높습니다.
                - score가 높을수록 사용자의 핵심 관심사일 가능성이 높습니다.
                - 여러 키워드가 반복적으로 비슷한 성향을 가리키면 해당 태그의 점수를 더 높게 평가할 수 있습니다.
                - 하나의 키워드에서 여러 태그가 가능하더라도, 의미상 강한 태그만 선택하세요.
                - 관련성이 약한 키워드는 제외할 수 있습니다.
                - 억지로 개수를 채우지 마세요. 적은 수의 정확한 태그가 많은 수의 부정확한 태그보다 낫습니다.

                [해석 참고 원칙]
                - 음식, 맛집, 카페, 디저트 관련 관심사는 Activity와 관련될 수 있습니다.
                - 도시, 야경, 트렌드, 브랜드, 테크 관련 관심사는 Vibe 또는 Landscape와 관련될 수 있습니다.
                - 자연, 바다, 숲, 산, 휴양 관련 관심사는 Landscape와 관련될 수 있습니다.
                - 전시, 음악, 공연, 감상 관련 관심사는 Activity 또는 Vibe와 관련될 수 있습니다.
                - 단, 위 원칙은 참고용이며 정답 예시가 아닙니다. 반드시 실제 입력 키워드 의미를 우선 해석하세요.

                [점수 규칙]
                - score: 해당 태그가 사용자 전체 관심사와 얼마나 관련 있는지 나타내는 값
                - confidence: 해당 태그 매핑에 대한 확신도
                - score와 confidence는 반드시 0.0 이상 1.0 이하의 실수여야 합니다.

                [출력 형식]
                반드시 아래 JSON 형식만 출력하세요.
                설명, 해설, 마크다운, 코드블록은 절대 포함하지 마세요.

                {
                  "tags": [
                    {
                      "category": "Vibe",
                      "tag": "로컬감성",
                      "score": 0.82,
                      "confidence": 0.77
                    }
                  ]
                }

                [출력 제약]
                - tags는 배열입니다.
                - 각 원소는 반드시 category, tag, score, confidence 필드를 포함해야 합니다.
                - 동일한 category/tag 조합은 중복되면 안 됩니다.
                - 최종 결과는 의미 있는 태그만 2개 이상 8개 이하로 출력하세요.
                - 적절한 태그가 거의 없다면 0개 또는 1개도 허용됩니다.
                - 출력은 반드시 JSON 객체 하나만 반환하세요.
                """, tagProvider.getAllowedTagsPrompt());
    }

    public String createUserPrompt(List<InterestKeywordCandidate> keywords) {
        if (keywords == null || keywords.isEmpty()) {
            return """
                    아래 입력 데이터는 비어 있습니다.
                    규칙에 맞는 JSON만 출력하세요.

                    {
                      "tags": []
                    }
                    """;
        }

        String jsonData = keywords.stream()
                .map(k -> String.format(
                        "{\"keyword\":\"%s\",\"score\":%.2f,\"confidence\":%.2f,\"travelRelevance\":%.2f}",
                        escape(k.getNormalizedKeyword()),
                        normalize(k.getScore()),
                        normalize(k.getConfidence()),
                        normalize(k.getTravelRelevance())
                ))
                .collect(Collectors.joining(",\n  ", "[\n  ", "\n]"));

        return """
                아래는 사용자의 관심 키워드 목록입니다.
                이 키워드들을 개별적으로 보지 말고, 전체적으로 종합하여 사용자의 여행 취향 태그를 추출하세요.

                [중요]
                - keyword 값을 그대로 tag로 출력하면 안 됩니다.
                - 반드시 허용 태그 목록에서만 선택하세요.
                - 관련성이 낮은 키워드는 제외할 수 있습니다.
                - 출력은 JSON만 반환하세요.

                [입력 데이터]
                """ + jsonData;
    }

    private String escape(String s) {
        if (s == null) {
            return "";
        }
        return s
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private double normalize(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) {
            return 0.0;
        }
        if (value < 0.0) {
            return 0.0;
        }
        if (value > 1.0) {
            return 1.0;
        }
        return value;
    }
}