package com.example.dahaeng.interest.config;

import com.example.dahaeng.interest.enums.InterestCategory;
import com.example.dahaeng.interest.enums.InterestSourceType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Set;

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
     */
    @Bean
    public Map<String, String> synonymMap() {
        return Map.of(
                "iphone", "아이폰",
                "apple watch", "애플워치",
                "macbook", "맥북",
                "tesla", "테슬라",
                "태슬라", "테슬라",
                "ev", "전기차",
                "electric vehicle", "전기차",
                "backend", "백엔드",
                "frontend", "프론트엔드",
                "springboot", "스프링부트",
                "java", "자바",
                "python", "파이썬",
                "chatgpt", "챗gpt"
        );
    }

    /**
     * 복합어 보호 사전: 토큰화 전 공백을 언더스코어(_)로 치환하여 단어 의미를 보존합니다.
     */
    @Bean
    public Map<String, String> phraseNormalizationMap() {
        return Map.of(
                "백엔드 개발", "백엔드_개발",
                "프론트엔드 개발", "프론트엔드_개발",
                "스프링 시큐리티", "스프링_시큐리티",
                "전기차 충전", "전기차_충전",
                "자취 요리", "자취_요리",
                "법률 상식", "법률_상식",
                "해외 축구", "해외_축구",
                "국내 여행", "국내_여행"
        );
    }

    @Bean
    public Map<InterestSourceType, Double> sourceWeightMap() {
        return Map.of(
                InterestSourceType.PLAYLIST_VIDEO_TAG, 3.0,
                InterestSourceType.LIKED_VIDEO_TAG, 2.5,
                InterestSourceType.SUBSCRIPTION_TITLE, 2.0,
                InterestSourceType.PLAYLIST_TITLE, 1.5,
                InterestSourceType.VIDEO_TITLE, 1.0
        );
    }

    @Bean
    public Map<String, InterestCategory> categoryMap() {
        return Map.of(
                "야구", InterestCategory.SPORTS_BASEBALL,
                "축구", InterestCategory.SPORTS_FOOTBALL,
                "카페", InterestCategory.CAFE,
                "자동차", InterestCategory.MOBILITY_AUTO,
                "맛집", InterestCategory.FOOD,
                "백엔드_개발", InterestCategory.TECHNOLOGY,
                "전기차_충전", InterestCategory.MOBILITY_AUTO
        );
    }
}
