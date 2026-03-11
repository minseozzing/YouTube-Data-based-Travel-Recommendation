package com.example.dahaeng.domain.city.controller;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.city.dto.response.CityResponse;
import com.example.dahaeng.domain.city.service.CityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/city")
public class CityController {

	private final CityService cityService;

	@GetMapping("/list")
	public ResponseEntity<List<CityResponse>> list(@Param("countryId") Long countryId) {
		return ResponseEntity.ok(cityService.list(countryId));
	}
}
