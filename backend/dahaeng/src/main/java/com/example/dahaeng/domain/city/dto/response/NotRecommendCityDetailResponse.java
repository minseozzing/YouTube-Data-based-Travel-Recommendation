package com.example.dahaeng.domain.city.dto.response;

import java.util.List;

public record NotRecommendCityDetailResponse(
        String name,
        LivingCostFor1Day livingCostFor1Day,
        AirTicketAndHotel airTicketAndHotel,
        String danger,
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
