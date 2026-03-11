package com.example.dahaeng.domain.livingcost.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.livingcost.dto.request.LivingCostComparisonRequest;
import com.example.dahaeng.domain.livingcost.dto.request.LivingCostDetailRequest;
import com.example.dahaeng.domain.livingcost.dto.response.compare.LivingCostComparisonResponse;
import com.example.dahaeng.domain.livingcost.dto.response.detail.LivingCostDetailResponse;
import com.example.dahaeng.domain.livingcost.service.LivingCostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cost")
@Slf4j
public class LivingCostController {

	private final LivingCostService costService;

	@GetMapping("/detail")
	public ResponseEntity<LivingCostDetailResponse> detail(@ModelAttribute LivingCostDetailRequest request) {
		return ResponseEntity.ok(costService.getLivingCost(request));
	}

	@GetMapping("/compare")
	public ResponseEntity<LivingCostComparisonResponse> compare(@ModelAttribute LivingCostComparisonRequest request) {
		log.info("request={}", request);
		return ResponseEntity.ok(costService.getComparison(request));
	}
}
