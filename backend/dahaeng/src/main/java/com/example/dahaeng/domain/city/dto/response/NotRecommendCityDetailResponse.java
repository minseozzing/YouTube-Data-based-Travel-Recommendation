package com.example.dahaeng.domain.city.dto.response;

import java.util.List;

import com.example.dahaeng.domain.country.dto.response.CountryDangerResponse;

public record NotRecommendCityDetailResponse(
        Long id,
        String name,
        LivingCostFor1Day livingCostFor1Day,
        AirTicketAndHotel airTicketAndHotel,
        CountryDangerResponse danger,
        List<TagResponse> tags
) {
    public record LivingCostFor1Day(
            double food,
            double transportation
    ){
    }
    public record AirTicketAndHotel(
            double airTicket,
            double hotel
    ){}

    public record TagResponse(
            String name,
            Double tagScore
    ){}

}
