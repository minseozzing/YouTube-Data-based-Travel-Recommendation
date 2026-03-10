package com.example.dahaeng.domain.livingcost.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dahaeng.domain.exchange.entity.Exchange;
import com.example.dahaeng.domain.exchange.enums.Currency;
import com.example.dahaeng.domain.exchange.repository.ExchangeRepository;
import com.example.dahaeng.domain.livingcost.dto.request.LivingCostComparisonRequest;
import com.example.dahaeng.domain.livingcost.dto.request.LivingCostDetailRequest;
import com.example.dahaeng.domain.livingcost.dto.response.compare.LivingCostComparisonResponse;
import com.example.dahaeng.domain.livingcost.dto.response.detail.LivingCostDetailResponse;
import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCity;
import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCountry;
import com.example.dahaeng.domain.livingcost.repository.LivingCostOfCityRepository;
import com.example.dahaeng.domain.livingcost.repository.LivingCostOfCountryRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LivingCostService {
	private final LivingCostOfCityRepository cityRepository;
	private final LivingCostOfCountryRepository countryRepository;
	private final ExchangeRepository exchangeRepository;

	/**
	 * 臾쇨? ?곸꽭 議고쉶
	 */
	public LivingCostDetailResponse getLivingCost(LivingCostDetailRequest request) {
		Exchange usd = exchangeRepository.findFirstByCurrencyOrderByEventDateDesc(Currency.USD)
			.orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_ERROR, "환율 정보를 찾지 못했습니다."));

		return switch (request.targetType()) {
			case CITY -> getLivingCostOfCity(request.targetId(), usd);
			case COUNTRY -> getLivingCostOfCountry(request.targetId(), usd);
			default -> throw new CustomException(ErrorCode.EXTERNAL_API_BAD_RESPONSE, "잘못된 요청입니다.");
		};
	}

	private LivingCostDetailResponse getLivingCostOfCity(Long cityId, Exchange usd) {
		LivingCostOfCity livingCost = cityRepository.findOneByCityId(cityId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 도시 아이디입니다."));

		return LivingCostDetailResponse.from(livingCost, usd.getKrwPer1cur());
	}


	private LivingCostDetailResponse getLivingCostOfCountry(Long countryId, Exchange usd) {
		LivingCostOfCountry livingCost = countryRepository.findOneByCountryId(countryId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 국가 아이디입니다."));

		return LivingCostDetailResponse.from(livingCost, usd.getKrwPer1cur());
	}

	/**
	 * 臾쇨? 鍮꾧탳
	 */

	public LivingCostComparisonResponse getComparison(LivingCostComparisonRequest request) {
		Exchange usd = exchangeRepository.findFirstByCurrencyOrderByEventDateDesc(Currency.USD)
			.orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_ERROR, "환율 정보를 찾지 못했습니다."));

		return switch (request.targetType()) {
			case CITY -> getCityComparison(request.baseId(), request.targetId(), usd);
			case COUNTRY -> getCountryComparison(request.baseId(), request.targetId(), usd);
			default -> throw new CustomException(ErrorCode.EXTERNAL_API_BAD_RESPONSE, "잘못된 요청입니다.");
		};
	}

	private LivingCostComparisonResponse getCountryComparison(Long baseId, Long targetId, Exchange usd) {
		LivingCostOfCountry baseLivingCost = countryRepository.findOneByCountryId(baseId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 국가 아이디입니다."));

		LivingCostOfCountry targetLivingCost = countryRepository.findOneByCountryId(targetId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 국가 아이디입니다."));

		return LivingCostComparisonResponse.from(baseLivingCost, targetLivingCost, usd);
	}

	private LivingCostComparisonResponse getCityComparison(Long baseId, Long targetId, Exchange usd) {
		LivingCostOfCity baseLivingCost = cityRepository.findOneByCityId(baseId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 도시 아이디입니다."));

		LivingCostOfCity targetLivingCost = cityRepository.findOneByCityId(targetId)
			.orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "유효하지 않은 도시 아이디입니다."));

		return LivingCostComparisonResponse.from(baseLivingCost, targetLivingCost, usd);
	}

}

