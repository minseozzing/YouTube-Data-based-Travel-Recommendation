package com.example.dahaeng.domain.bookmark.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.dahaeng.domain.bookmark.dto.request.BookMarkCreateRequest;
import com.example.dahaeng.domain.bookmark.dto.response.BookmarkDetailResponse;
import com.example.dahaeng.domain.bookmark.entity.Bookmark;
import com.example.dahaeng.domain.bookmark.repository.BookmarkRepository;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.repository.CityRepository;
import com.example.dahaeng.domain.exchange.dto.response.current.ExchangeRateResponse;
import com.example.dahaeng.domain.exchange.entity.Exchange;
import com.example.dahaeng.domain.exchange.repository.ExchangeRepository;
import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.example.dahaeng.domain.member.service.MemberService;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {
	private final BookmarkRepository bookmarkRepository;
	private final MemberRepository memberRepository;
	private final ExchangeRepository exchangeRepository;
	private final CityRepository cityRepository;

	public BookmarkDetailResponse detail(Long bookmarkId, Long memberId) {
		Member member = validMember(memberId);

		Bookmark bookmark = bookmarkRepository
			.findFirstByIdAndMemberAndIsDeletedFalse(bookmarkId, member)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 북마크 아이디입니다."));

		Exchange exchange = exchangeRepository
			.findFirstByCurrencyOrderByEventDateDesc(bookmark.getCity().getCountry().getCurrency())
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 환율 아이디입니다."));

		return new BookmarkDetailResponse(
			bookmark.getJson(),
			ExchangeRateResponse.from(exchange)
		);
	}

	public void save(BookMarkCreateRequest request, Long memberId) {
		Member member = validMember(memberId);

		City city = cityRepository.findById(request.cityId())
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 도시 아이디입니다."));

		Bookmark bookmark = Bookmark.builder()
			.member(member)
			.city(city)
			.json(request.json())
			.build();

		bookmarkRepository.save(bookmark);
	}

	private Member validMember(Long memberId) {
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "사용자 정보가 없습니다."));
	}
}
