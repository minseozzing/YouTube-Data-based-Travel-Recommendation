package com.example.dahaeng.domain.bookmark.dto.response;

import com.example.dahaeng.domain.exchange.dto.response.current.ExchangeRateResponse;

public record BookmarkDetailResponse(
	String json,
	ExchangeRateResponse currentExchange
) {
}
