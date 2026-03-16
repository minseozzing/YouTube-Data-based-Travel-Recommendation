package com.example.dahaeng.domain.place.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.entity.MemberTag;
import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.example.dahaeng.domain.member.repository.MemberTagRepository;
import com.example.dahaeng.domain.place.dto.response.PlaceDetailResponse;
import com.example.dahaeng.domain.place.dto.response.PlaceResponse;
import com.example.dahaeng.domain.place.dto.util.PlaceTagDto;
import com.example.dahaeng.domain.place.entity.SpotTag;
import com.example.dahaeng.domain.place.entity.TouristSpot;
import com.example.dahaeng.domain.place.repository.SpotTagRepository;
import com.example.dahaeng.domain.place.repository.TouristSpotRepository;
import com.example.dahaeng.domain.recommend.repository.SpotTagScoreProjection;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

	private final MemberRepository memberRepository;
	private final MemberTagRepository memberTagRepository;
	private final TouristSpotRepository touristSpotRepository;
	private final SpotTagRepository spotTagRepository;

	public List<PlaceResponse> places(Long cityId, Long memberId) {
		// 1. memberId 확인
		// 2. 분기 ( 추천, 비추천 )
		if (memberId == null) {
			return recommend(cityId, memberId);
		} else {
			return unrecommend(cityId);
		}
	}

	private List<PlaceResponse> recommend(Long cityId, Long memberId) {
		Member member = validMember(memberId);

		List<MemberTag> memberTags = memberTagRepository.findAllByMember(member);
		List<TouristSpot> places = touristSpotRepository.findByCityId(cityId);

		List<String> selectedTags = memberTags.stream()
			.map(tag -> tag.getTag().getName())
			.toList();

		List<Long> placeIds = places.stream()
			.map(place -> place.getId())
			.toList();

		Map<Long, List<SpotTagScoreProjection>> spotMap = new HashMap<>();

		spotTagRepository
			.findTagScoresBySpotIds(placeIds, selectedTags)
			.forEach((tag) -> {
				List<SpotTagScoreProjection> list = spotMap.getOrDefault(tag.getSpotId(), new ArrayList<>());
				list.add(tag);
			});

		PriorityQueue<PlaceTagDto> pq = new PriorityQueue<>((o1, o2) -> {
			double o1Score = o1.tags()
				.stream()
				.mapToDouble(SpotTagScoreProjection::getScore)
				.average()
				.getAsDouble();

			double o2Score = o2.tags()
				.stream()
				.mapToDouble(SpotTagScoreProjection::getScore)
				.average()
				.getAsDouble();

			return Double.compare(o2Score, o1Score);
		});

		places.forEach(place -> pq.add(new PlaceTagDto(place, spotMap.get(place.getId()))));

		List<PlaceResponse> res = new ArrayList<>();

		for (PlaceTagDto placeTagDto : pq) {
			res.add(new PlaceResponse())
		}
		return null;
	}

	private List<PlaceResponse> unrecommend(Long cityId) {
		return null;
	}

	private Member validMember(Long memberId) {
		return memberRepository
			.findById(memberId)
			.orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "유효하지 않은 멤버아이디입니다."));
	}
}
