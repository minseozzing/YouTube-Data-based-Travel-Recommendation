package com.example.dahaeng.domain.interest.config;

import com.example.dahaeng.domain.interest.enums.InterestCategory;
import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Set;

@Configuration
public class InterestDictionaryConfig {

    @Bean
    public Set<String> stopwords() {
        return Set.of("뉴스", "실시간", "공식", "live", "shorts");
    }

    @Bean
    public Map<String, String> phraseNormalizationMap() {
        return Map.of(
                "2단계 인증", "mfa",
                "스프링 시큐리티", "spring_security",
                "전기차", "electric_vehicle"
        );
    }

    @Bean
    public Map<String, String> synonymMap() {
        return Map.of(
                "테슬라", "tesla",
                "tesla", "tesla",
                "태슬라", "tesla",
                "2fa", "mfa",
                "mfa", "mfa",
                "2단계 인증", "mfa"
        );
    }

    @Bean
    public Map<String, InterestCategory> categoryMap() {
        return Map.of(
                "야구", InterestCategory.SPORTS_BASEBALL,
                "축구", InterestCategory.SPORTS_FOOTBALL,
                "카페", InterestCategory.CAFE,
                "자동차", InterestCategory.MOBILITY_AUTO,
                "맛집", InterestCategory.FOOD
        );
    }

    @Bean
    public Map<InterestSourceType, Double> sourceWeightMap() {
        return Map.of(
                InterestSourceType.LIKED_VIDEO_TAG, 4.0,
                InterestSourceType.LIKED_VIDEO_TITLE, 3.0,
                InterestSourceType.PLAYLIST_VIDEO_TAG, 3.0,
                InterestSourceType.PLAYLIST_VIDEO_TITLE, 2.0,
                InterestSourceType.PLAYLIST_TITLE, 1.0,
                InterestSourceType.SUBSCRIPTION_TITLE, 2.0
        );
    }
}
