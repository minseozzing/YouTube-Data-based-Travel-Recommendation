package com.example.dahaeng.domain.bookmark.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dahaeng.domain.bookmark.dto.request.BookMarkCreateRequest;
import com.example.dahaeng.global.dto.response.NoContentResponse;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkDetailResponse;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkSummaryResponse;
import com.example.dahaeng.domain.bookmark.entity.Bookmark;
import com.example.dahaeng.domain.bookmark.repository.BookmarkRepository;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.repository.CityRepository;
import com.example.dahaeng.domain.exchange.dto.response.current.ExchangeRateResponse;
import com.example.dahaeng.domain.exchange.entity.Exchange;
import com.example.dahaeng.domain.exchange.repository.ExchangeRepository;
import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.example.dahaeng.global.dto.response.PageResponse;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {
	private final BookmarkRepository bookmarkRepository;
	private final MemberRepository memberRepository;
	private final ExchangeRepository exchangeRepository;
	private final CityRepository cityRepository;
	private final ObjectMapper mapper;

	@Transactional(readOnly = true)
	public BookmarkDetailResponse detail(Long bookmarkId, Long memberId) throws JsonProcessingException {
		Member member = validMember(memberId);

		Bookmark bookmark = bookmarkRepository
			.findFirstByIdAndMemberAndIsDeletedFalse(bookmarkId, member)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 북마크 아이디입니다."));

		Exchange exchange = exchangeRepository
			.findFirstByCurrencyOrderByEventDateDesc(bookmark.getCity().getCountry().getCurrency())
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 환율 아이디입니다."));

		return new BookmarkDetailResponse(
			bookmark.getId(),
			mapper.readTree(bookmark.getJson()),
			ExchangeRateResponse.from(exchange)
		);
	}

	public NoContentResponse save(BookMarkCreateRequest request, Long memberId) throws JsonProcessingException {
		Member member = validMember(memberId);

		City city = cityRepository.findById(request.cityId())
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 도시 아이디입니다."));

		Bookmark bookmark = Bookmark.builder()
			.member(member)
			.city(city)
			.json(mapper.writeValueAsString(request.json()))
			.build();

		return new NoContentResponse("북마크 생성 완료", bookmarkRepository.save(bookmark).getId());
	}

	@Transactional(readOnly = true)
	public PageResponse<BookmarkSummaryResponse> summaries(String keyword, Long memberId, Pageable pageable) {
		Member member = validMember(memberId);

		Page<Bookmark> bookmarks = bookmarkRepository.findAllByKeywordAndMember(keyword, member, pageable);

		return PageResponse.from(
			new PageImpl<>(bookmarks.stream()
				.map(BookmarkSummaryResponse::from)
				.toList(), pageable, bookmarks.getTotalElements())
		);
	}

	public NoContentResponse delete(Long id, Long memberId) {
		Member member = validMember(memberId);

		Bookmark bookmark = bookmarkRepository
			.findFirstByIdAndMemberAndIsDeletedFalse(id, member)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 북마크 아이디입니다."));

		bookmark.delete();

		return new NoContentResponse("북마크 삭제가 완료되었습니다.", bookmark.getId());
	}

	private Member validMember(Long memberId) {
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자 정보가 없습니다."));
	}
}
