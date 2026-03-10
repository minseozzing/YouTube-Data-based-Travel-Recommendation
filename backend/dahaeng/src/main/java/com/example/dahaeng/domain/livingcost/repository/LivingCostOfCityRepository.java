package com.example.dahaeng.domain.livingcost.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCity;

public interface LivingCostOfCityRepository extends JpaRepository<LivingCostOfCity, Long> {
	@Query("select lcc from LivingCostOfCity lcc join fetch lcc.city c join fetch c.country where c.id = :id and lcc.isDeleted = false")
	Optional<LivingCostOfCity> findOneByCityId(Long id);
}
