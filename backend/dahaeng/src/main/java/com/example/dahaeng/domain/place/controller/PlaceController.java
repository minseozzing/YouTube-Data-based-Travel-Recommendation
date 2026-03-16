package com.example.dahaeng.domain.place.controller;

import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.place.service.PlaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PlaceController {

	private final PlaceService placeService;

	@GetMapping("/{cityId}/places")
	public ResponseEntity<?> places(
		@PathVariable("cityId") Long cityId,
		@AuthenticationPrincipal CustomOAuth2User user
	) {
		return ResponseEntity.ok(placeService.places(cityId, user != null ? user.getId() : null));
	}

	@GetMapping("/{cityId]/place/{id}")
	public ResponseEntity<?> detail(
		@PathVariable("cityId") Long cityId,
		@PathVariable("id") Long id,
		@AuthenticationPrincipal CustomOAuth2User user
	) {
		return ResponseEntity.ok(null);
	}
}
