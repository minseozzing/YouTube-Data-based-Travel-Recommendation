package com.example.dahaeng.interest.config;

import com.example.dahaeng.interest.enums.InterestCategory;
import com.example.dahaeng.interest.enums.InterestSourceType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Set;

import static java.util.Map.entry;

@Configuration
public class InterestDictionaryConfig {

    @Bean
    public Set<String> stopwords() {
        return Set.of("뉴스", "실시간", "live", "영상", "채널", "playlist", "video", "모음");
    }

    @Bean
    public Set<String> genericKeywords() {
        return Set.of("추천", "정보", "리뷰", "정리", "공식", "official", "shorts", "꿀팁", "후기", "방법", "vlog", "꿀전");
    }

    /**
     * 유의어 통합 사전: 모든 외래어/약어를 한국어 표준 키워드로 통합합니다.
     * Map.of() 대신 Map.ofEntries()를 사용하여 10개 이상의 항목을 수용합니다.
     */
    @Bean
    public Map<String, String> synonymMap() {
        return Map.ofEntries(
                entry("iphone", "아이폰"),
                entry("apple watch", "애플워치"),
                entry("macbook", "맥북"),
                entry("tesla", "테슬라"),
                entry("태슬라", "테슬라"),
                entry("ev", "전기차"),
                entry("electric vehicle", "전기차"),
                entry("backend", "백엔드"),
                entry("frontend", "프론트엔드"),
                entry("springboot", "스프링부트"),
                entry("java", "자바"),
                entry("python", "파이썬"),
                entry("chatgpt", "챗gpt")
        );
    }

    /**
     * 복합어 보호 사전: 토큰화 전 공백을 언더스코어(_)로 치환하여 단어 의미를 보존합니다.
     */
    @Bean
    public Map<String, String> phraseNormalizationMap() {
        return Map.ofEntries(
                entry("백엔드 개발", "백엔드_개발"),
                entry("프론트엔드 개발", "프론트엔드_개발"),
                entry("스프링 시큐리티", "스프링_시큐리티"),
                entry("전기차 충전", "전기차_충전"),
                entry("자취 요리", "자취_요리"),
                entry("법률 상식", "법률_상식"),
                entry("해외 축구", "해외_축구"),
                entry("국내 여행", "국내_여행")
        );
    }

    @Bean
    public Map<InterestSourceType, Double> sourceWeightMap() {
        return Map.of(
                InterestSourceType.PLAYLIST_VIDEO_TAG, 3.0,
                InterestSourceType.LIKED_VIDEO_TAG, 2.5,
                InterestSourceType.SUBSCRIPTION_TITLE, 2.0,
                InterestSourceType.PLAYLIST_TITLE, 1.5,
                InterestSourceType.PLAYLIST_VIDEO_TITLE, 1.0,
                InterestSourceType.LIKED_VIDEO_TITLE, 1.0
        );
    }

    @Bean
    public Map<String, InterestCategory> categoryMap() {
        return Map.ofEntries(
                entry("야구", InterestCategory.SPORTS_BASEBALL),
                entry("축구", InterestCategory.SPORTS_FOOTBALL),
                entry("카페", InterestCategory.CAFE),
                entry("자동차", InterestCategory.MOBILITY_AUTO),
                entry("맛집", InterestCategory.FOOD),
                entry("백엔드_개발", InterestCategory.TECHNOLOGY),
                entry("전기차_충전", InterestCategory.MOBILITY_AUTO)
        );
    }
}
