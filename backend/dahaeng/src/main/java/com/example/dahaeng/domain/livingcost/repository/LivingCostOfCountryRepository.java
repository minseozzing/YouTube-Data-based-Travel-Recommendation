package com.example.dahaeng.domain.livingcost.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCountry;

public interface LivingCostOfCountryRepository extends JpaRepository<LivingCostOfCountry, Long> {
	@Query("select lcc from LivingCostOfCountry lcc join fetch lcc.country c where c.id = :id and lcc.isDeleted = false")
	Optional<LivingCostOfCountry> findOneByCountryId(Long id);
}
