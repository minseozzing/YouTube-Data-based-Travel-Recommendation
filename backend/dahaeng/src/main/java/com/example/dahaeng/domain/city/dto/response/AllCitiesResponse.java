package com.example.dahaeng.domain.city.dto.response;


public record AllCitiesResponse(
        String name,
        String imgUrl,
        Double expectedBudgetFor1day,
        String danger,
        String dangerDescription,

        Double lat,
        Double lon
) {
}
