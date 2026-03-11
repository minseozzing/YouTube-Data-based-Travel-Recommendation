package com.example.dahaeng.domain.country.repository;

import com.example.dahaeng.domain.country.entity.Danger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DangerRepository extends JpaRepository<Danger, Long> {
    Optional<Danger> findByCountryId(Long countryId);
}
