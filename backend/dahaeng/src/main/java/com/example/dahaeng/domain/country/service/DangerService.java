package com.example.dahaeng.domain.country.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.dahaeng.domain.country.dto.response.CountryDanger;
import com.example.dahaeng.domain.country.dto.response.CountryDangerResponse;
import com.example.dahaeng.domain.country.entity.Danger;
import com.example.dahaeng.domain.country.repository.DangerRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DangerService {

	private final DangerRepository dangerRepository;

	public CountryDangerResponse dangers(Long countryId) {
		Danger danger = dangerRepository.findByCountryId(countryId)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 국가 아이디입니다."));

		List<CountryDanger> res = new ArrayList<>();

		addAttention(res, danger);
		addBan(res, danger);
		addLimita(res, danger);

		return new CountryDangerResponse(danger.getCountry().getCountryName(), res);
	}

	private void addAttention(List<CountryDanger> res, Danger danger) {
		addDanger(res, danger.getAttention(), danger.getAttentionNote());
		addDanger(res, danger.getAttentionPartial(), danger.getAttentionNote());
	}

	private void addBan(List<CountryDanger> res, Danger danger) {
		addDanger(res, danger.getBanYna(), danger.getBanNote());
		addDanger(res, danger.getBanYnPartial(), danger.getBanNote());

	}

	private void addLimita(List<CountryDanger> res, Danger danger) {
		addDanger(res, danger.getLimita(), danger.getLimitaNote());
		addDanger(res, danger.getLimitaPartial(), danger.getLimitaNote());
	}

	private static void addDanger(List<CountryDanger> res, String level, String description) {
		if (StringUtils.hasText(level)) {
			res.add(
				new CountryDanger(
					level,
					description
				)
			);
		}
	}
}
