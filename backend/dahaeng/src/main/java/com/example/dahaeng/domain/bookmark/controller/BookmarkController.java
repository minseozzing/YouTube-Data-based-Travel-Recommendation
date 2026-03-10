package com.example.dahaeng.domain.bookmark.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dahaeng.domain.auth.dto.CustomOAuth2User;
import com.example.dahaeng.domain.bookmark.dto.request.BookMarkCreateRequest;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkDetailResponse;
import com.example.dahaeng.domain.bookmark.service.BookmarkService;
import com.fasterxml.jackson.core.JsonProcessingException;

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
		@AuthenticationPrincipal CustomOAuth2User principal
	) throws JsonProcessingException {
		return ResponseEntity.ok(bookmarkService.detail(bookmarkId, principal.getId()));
	}

	@PostMapping
	public ResponseEntity<?> save(
		@RequestBody @Valid BookMarkCreateRequest request,
		@AuthenticationPrincipal CustomOAuth2User principal
	) throws JsonProcessingException {
		return new ResponseEntity<>(
			bookmarkService.save(request, principal.getId()),
			HttpStatus.CREATED
		);
	}
}
