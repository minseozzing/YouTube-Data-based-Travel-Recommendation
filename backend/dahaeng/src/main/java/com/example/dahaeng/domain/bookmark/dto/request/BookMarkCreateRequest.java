package com.example.dahaeng.domain.bookmark.dto.request;

public record BookMarkCreateRequest(
	@NotBlank Long cityId,
	String json,
	String imgUrl
) {
}
