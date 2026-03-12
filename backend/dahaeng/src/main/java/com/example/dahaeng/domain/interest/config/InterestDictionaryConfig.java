package com.example.dahaeng.domain.interest.config;

// [DELETE_START] (아래 1줄 삭제)
import com.example.dahaeng.domain.interest.enums.InterestCategory;
// [DELETE_END]
import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.Set;

import static java.util.Map.entry;

@Configuration
public class InterestDictionaryConfig {

    // ... (생략) ...

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

    // [DELETE_START] (아래 메서드 블록 전체 삭제)
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
    // [DELETE_END]
}
