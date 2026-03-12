package com.example.dahaeng.domain.place.repository;

import com.example.dahaeng.domain.place.entity.TouristSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TouristSpotRepository extends JpaRepository<TouristSpot, Long> {
    List<TouristSpot> findByCityId(Long cityId);
}
