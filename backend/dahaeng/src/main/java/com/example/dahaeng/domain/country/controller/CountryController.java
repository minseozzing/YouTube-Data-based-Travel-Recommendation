package com.example.dahaeng.domain.country.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.country.dto.response.CountryResponse;
import com.example.dahaeng.domain.country.service.CountryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/country")
public class CountryController {

	private final CountryService countryService;

	@GetMapping("/list")
	public ResponseEntity<List<CountryResponse>> list() {
		return ResponseEntity.ok(countryService.list());
	}
}
