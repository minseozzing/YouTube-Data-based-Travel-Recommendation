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
            4. 입력 keyword 값을 tag로 그대로 출력하는 것을 절대 금지합니다.
            5. 적절한 태그가 없으면 억지로 생성하지 말고 제외하세요.
            6. 출력은 반드시 JSON 객체 하나만 반환하세요.

            [허용 태그 목록]
            %s

            [분류 원칙]
            - 입력은 사용자의 상위 관심 키워드 목록입니다.
            - 각 키워드는 score, confidence, travelRelevance 값을 가집니다.
            - score와 travelRelevance가 높은 키워드를 더 중요하게 해석하세요.
            - 여러 키워드가 반복적으로 같은 여행 성향을 가리키면 더 강한 태그로 판단할 수 있습니다.
            - 관련성이 약한 키워드는 제외할 수 있습니다.

            [reason 작성 규칙]
            - 각 태그마다 반드시 reason 필드를 작성하세요.
            - reason은 왜 이 태그를 선택했는지를 입력 키워드 기반으로 설명하는 짧은 한국어 문장 1개여야 합니다.
            - reason에는 추측성 표현(예: ~같음, 아마, 느낌상)을 쓰지 마세요.
            - 가능하면 입력 키워드의 유형을 드러내세요.
            - reason은 15자 이상 80자 이하로 작성하세요.
            - 태그명만 반복하지 말고, 선택 근거를 설명하세요.

            [점수 규칙]
            - score: 해당 태그가 사용자 전체 관심사와 얼마나 관련 있는지 나타내는 값
            - confidence: 해당 태그 매핑에 대한 확신도
            - score와 confidence는 반드시 0.0 이상 1.0 이하의 실수여야 합니다.

            [출력 형식]
            반드시 아래 JSON 형식만 출력하세요.
            설명, 해설, 코드블록, 마크다운은 절대 포함하지 마세요.

            {
              "tags": [
                {
                  "category": "Vibe",
                  "tag": "로컬감성",
                  "score": 0.82,
                  "confidence": 0.77,
                  "reason": "현지 분위기를 연상시키는 해외 지역 키워드가 반복적으로 나타남"
                }
              ]
            }

            [출력 제약]
            - tags는 배열입니다.
            - 각 원소는 반드시 category, tag, score, confidence, reason 필드를 모두 포함해야 합니다.
            - reason은 비어 있으면 안 됩니다.
            - 동일한 category/tag 조합은 중복되면 안 됩니다.
            - 의미 있는 태그만 0~8개 이내로 출력하세요.
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
            이 키워드들을 전체적으로 종합하여 사용자의 여행 취향 태그를 추출하세요.

            [중요]
            - keyword 값을 그대로 tag로 쓰면 안 됩니다.
            - 반드시 허용 태그 목록에서만 선택하세요.
            - 각 태그에는 reason 필드를 반드시 포함하세요.
            - reason은 입력 키워드 기반의 짧은 한국어 설명 1문장이어야 합니다.
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