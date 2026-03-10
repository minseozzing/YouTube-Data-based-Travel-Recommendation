package com.example.dahaeng.domain.bookmark.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.bookmark.dto.request.BookMarkCreateRequest;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkDetailResponse;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkSummaryResponse;
import com.example.dahaeng.domain.bookmark.service.BookmarkService;
import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
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
		@AuthenticationPrincipal CustomOAuth2User user
	) throws JsonProcessingException {
		return ResponseEntity.ok(bookmarkService.detail(bookmarkId, user.getId()));
	}

	@GetMapping
	public ResponseEntity<List<BookmarkSummaryResponse>> summaries(
		@RequestParam("keyword") @Nullable String keyword,
		@AuthenticationPrincipal CustomOAuth2User user
	) {
		return ResponseEntity.ok(bookmarkService.summaries(keyword, user.getId()));
	}

	@PostMapping
	public ResponseEntity<?> save(
		@RequestBody @Valid BookMarkCreateRequest request,
		@AuthenticationPrincipal CustomOAuth2User user
	) throws JsonProcessingException {
		return new ResponseEntity<>(
			bookmarkService.save(request, user.getId()),
			HttpStatus.CREATED
		);
	}
}
