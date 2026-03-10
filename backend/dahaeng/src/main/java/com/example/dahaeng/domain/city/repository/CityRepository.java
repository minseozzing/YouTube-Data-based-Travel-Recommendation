package com.example.dahaeng.domain.city.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dahaeng.domain.city.entity.City;

public interface CityRepository extends JpaRepository<City, Long> {
}
