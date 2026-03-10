package com.example.dahaeng.domain.exchange.dto.response.history;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExchangeRateTrendItemResponse(
	LocalDate date,
	BigDecimal rate1krwToTarget,
	BigDecimal krwPer1target
) {
}
