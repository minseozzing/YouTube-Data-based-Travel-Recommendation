package com.example.dahaeng.domain.recommend.Service;

public record CityRankResult(
        Long cityId,
        String countryName,
        String cityName,
        Double totalScore,
        Double budgetScore,
        Double safetyScore,
        Double tagScore,
        Double newsPenaltyScore,
        String currency,
        Double hotelPerDay,
        Double dailyLocalCost,
        String originAirport,
        Integer flightPrice,
        String description,
        Double lat,
        Double lon
) {
}
