package com.example.dahaeng.domain.recommend.dto.request;

import java.util.List;

public record RecommendCitiesRequest(
        List<String> selectedTags,
        Double userDailyBudget,
        Integer travelDays,
        Integer month
) {
}
