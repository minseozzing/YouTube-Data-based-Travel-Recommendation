package com.example.dahaeng.domain.bookmark.dto.response;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import com.example.dahaeng.domain.bookmark.entity.Bookmark;

public record BookmarkSummaryResponse(
	Long city,
	String cityName,
	String countryName,
	String imgUrl,
	LocalDateTime createdAt
) {
	public static BookmarkSummaryResponse from(Bookmark bookmark) {
		return new BookmarkSummaryResponse(
			bookmark.getCity().getId(),
			bookmark.getCity().getCityName(),
			bookmark.getCity().getCountry().getCountryName(),
			bookmark.getCity().getImgUrl(),
			bookmark.getCreatedAt()
		);
	}
}