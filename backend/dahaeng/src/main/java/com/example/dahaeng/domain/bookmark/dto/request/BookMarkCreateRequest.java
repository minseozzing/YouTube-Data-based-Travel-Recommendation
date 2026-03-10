package com.example.dahaeng.domain.bookmark.dto.request;

import jakarta.validation.constraints.NotNull;

public record BookMarkCreateRequest(
	@NotNull Long cityId,
	@NotNull Object json
) {
}
