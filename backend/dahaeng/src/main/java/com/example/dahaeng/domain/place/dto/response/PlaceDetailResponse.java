package com.example.dahaeng.domain.place.dto.response;

import java.util.List;

public record PlaceDetailResponse(
	Long id,
	String name,
	String description,
	String address,
	String socialUrl,
	String websiteUrl,
	List<SpotTagResponse> tags
) {
}
