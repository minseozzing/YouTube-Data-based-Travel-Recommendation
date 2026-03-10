package com.example.dahaeng.domain.bookmark.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkDetailResponse;
import com.example.dahaeng.domain.bookmark.service.BookmarkService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookmarks")
@Slf4j
public class BookmarkController {
	private final BookmarkService bookmarkService;

	@GetMapping("/{bookmarkId}")
	public ResponseEntity<BookmarkDetailResponse> detail(
		@PathVariable Long bookmarkId,
		@AuthenticationPrincipal CustomOAuth2User principal
	) {
		log.info("bookmarkId={}, userId={}", bookmarkId, principal.getId());
		return ResponseEntity.ok(bookmarkService.detail(bookmarkId, principal.getId()));
	}
}
