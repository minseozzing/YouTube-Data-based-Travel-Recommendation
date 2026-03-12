package com.example.dahaeng.domain.recommend.repository;

public interface CityCandidateProjection {
    Long getCityId();
    String getCityName();
    String getCountryName();
    String getCityImageUrl();
    String getDescription();
    Double getLat();
    Double getLon();
    Double getNewsPenaltyScore();
    Integer getAvgFlightPrice();
    Integer getAvgHotelPrice();
    Double getFoodCost();
    Double getTransportCost();
    String getDangerAttention();
    String getDangerControl();
    String getDangerLimita();

    String getCurrency();
    String getOriginAirport();
}
