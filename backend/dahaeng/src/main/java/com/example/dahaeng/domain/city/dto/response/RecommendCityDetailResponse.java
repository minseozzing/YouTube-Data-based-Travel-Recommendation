package com.example.dahaeng.domain.city.dto.response;


import java.util.List;

import com.example.dahaeng.domain.country.dto.response.CountryDangerResponse;

public record RecommendCityDetailResponse(
    String name,
    Score score,
    String recommendationReason,
    LivingCostFor1Day livingCostFor1Day,
    AirTicketAndHotel airTicketAndHotel,
    News news,
    CountryDangerResponse danger,
    List<TagResponse> tags,
    List<TouristSpotResponse> touristSpot
) {
    public record Score(
            Double finalScore,
            Double budgetScore,
            Double safetyScore,
            Double tagMatchScore,
            Double newPenaltyScore
    ){}


    public record LivingCostFor1Day(
            double food,
            double transportation
    ){
    }
    public record AirTicketAndHotel(
            double airTicket,
            double hotel
    ){}
    public record News(
            String summation,
            List<NewsItem> top3
    ){}

    public record NewsItem(
            String title,
            String url,
            String content,
            String description,
            String urlToImage,
            String publishedAt
    ){}

    public record TagResponse(
            String name,
            Double tagScore
    ){}

    public record TouristSpotResponse(
            String name,
            String description,
            Double lat,
            Double lon,
            String imageUrl
    ) { }
}
