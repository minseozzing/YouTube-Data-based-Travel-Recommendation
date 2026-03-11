package com.example.dahaeng.domain.city.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.dahaeng.domain.city.entity.City;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
}
