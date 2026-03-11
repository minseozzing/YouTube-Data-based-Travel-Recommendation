package com.example.dahaeng.domain.city.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dahaeng.domain.city.dto.response.CityResponse;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.repository.CityRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CityService {
	private final CityRepository cityRepository;

	public List<CityResponse> list(Long countryId) {
		if (countryId == null) {
			List<City> cities = cityRepository.findAllByIsDeletedFalse();
			return parseToCityListResponseList(cities);
		} else {
			List<City> cities = cityRepository.findAllByCountryIdAndIsDeletedFalse(countryId);
			return parseToCityListResponseList(cities);
		}
	}

	private List<CityResponse> parseToCityListResponseList(List<City> cities) {
		return cities
			.stream()
			.map(CityResponse::from)
			.toList();
	}
}
