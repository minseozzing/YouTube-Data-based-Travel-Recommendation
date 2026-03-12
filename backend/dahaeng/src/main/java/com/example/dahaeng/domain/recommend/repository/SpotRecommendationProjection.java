package com.example.dahaeng.domain.recommend.repository;

public interface SpotRecommendationProjection {
    Long getSpotId();
    Long getCityId();
    String getPlaceName();
    String getDescription();
    Double getLat();
    Double getLon();
    Double getMatchScore();
}
