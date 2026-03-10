package com.example.dahaeng.domain.exchange.dto.response.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ExchangeRateTrendResponse(
	String baseCurrency,
	String targetCurrency,
	String type,
	ExchangeRateLatestResponse latest,
	List<ExchangeRateTrendItemResponse> trend
) {
}
