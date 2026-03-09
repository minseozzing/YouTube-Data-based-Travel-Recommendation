package com.example.dahaeng.domain.livingcost.dto.response;

public record TargetResponse(
	Long id,
	String name,
	String parentRegion,
	String currency,
	String imgUrl
) {
}