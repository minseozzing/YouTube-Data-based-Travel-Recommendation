package com.example.dahaeng.domain.livingcost.service;

import org.springframework.stereotype.Service;

import com.example.dahaeng.domain.exchange.entity.Exchange;
import com.example.dahaeng.domain.exchange.enums.Currency;
import com.example.dahaeng.domain.exchange.repository.ExchangeRepository;
import com.example.dahaeng.domain.livingcost.dto.response.detail.LivingCostDetailResponse;
import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCity;
import com.example.dahaeng.domain.livingcost.repository.LivingCostOfCityRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class LivingCostOfCityService {
	private final LivingCostOfCityRepository cityRepository;
	private final ExchangeRepository exchangeRepository;

	public LivingCostDetailResponse getLivingCost(Long cityId) {
		LivingCostOfCity livingCost = cityRepository.findOneByCityId(cityId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 도시 아이디입니다."));

		Exchange usd = exchangeRepository.findFirstByCurrencyOrderByEventDateDesc(Currency.USD)
			.orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_ERROR, "환율 정보가 존재하지 않습니다."));

		return LivingCostDetailResponse.from(livingCost, usd.getKrwPer1cur());
	}
}
