package com.example.dahaeng.domain.city.service;

import com.example.dahaeng.domain.city.dto.response.AllCitiesResponse;
import com.example.dahaeng.domain.city.dto.response.CityResponse;
import com.example.dahaeng.domain.city.dto.response.NotRecommendCityDetailResponse;
import com.example.dahaeng.domain.city.dto.response.RecommendCityDetailResponse;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.repository.CityRepository;
import com.example.dahaeng.domain.city.repository.CityTagRepository;
import com.example.dahaeng.domain.country.entity.Danger;
import com.example.dahaeng.domain.country.repository.DangerRepository;
import com.example.dahaeng.domain.flight.entity.FlightSummary;
import com.example.dahaeng.domain.flight.repository.FlightSummaryRepository;
import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCity;
import com.example.dahaeng.domain.livingcost.repository.LivingCostOfCityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityService {
    private static final String DEFAULT_DANGER_LABEL = "안전";

    private final CityRepository cityRepository;
    private final FlightSummaryRepository flightSummaryRepository;
    private final LivingCostOfCityRepository livingCostOfCityRepository;
    private final DangerRepository dangerRepository;
    private final CityTagRepository cityTagRepository;

    public List<AllCitiesResponse> getAllCities() {
        YearMonth now = YearMonth.now();
        String targetYearMonth = YearMonth.of(now.getYear(), now.getMonth()).toString();
        List<City> cities = cityRepository.findAll();
        Map<Long, Danger> dangerByCountryId = getDangerByCountryId(cities);
        List<AllCitiesResponse> result = new ArrayList<>();

        for (City city : cities) {
            double flightAndHotel = 0.0;

            FlightSummary summary = flightSummaryRepository
                    .findByCityIdAndYearMonthWithCity(city.getId(), targetYearMonth)
                    .orElse(null);
            if (summary != null) {
                double avgFlightPrice = summary.getAvgFlightPrice() != null ? summary.getAvgFlightPrice() : 0.0;
                double avgHotelPrice = summary.getAvgHotelPrice() != null ? summary.getAvgHotelPrice() : 0.0;
                flightAndHotel = avgFlightPrice + avgHotelPrice;
            }

            double localLivingCost = 0.0;
            LivingCostOfCity cost = livingCostOfCityRepository.findOneByCityId(city.getId()).orElse(null);
            if (cost != null) {
                double transport = cost.getTransport() != null ? cost.getTransport() : 0.0;
                double food = cost.getFood() != null ? cost.getFood() : 0.0;
                localLivingCost = transport + food;
            }

            Danger danger = dangerByCountryId.get(city.getCountry().getId());
            String dangerLabel = danger != null ? getDangerLabel(danger) : DEFAULT_DANGER_LABEL;
            String dangerDescription = danger != null ? getDangerDescription(danger) : null;

            result.add(new AllCitiesResponse(
                    city.getCityName(),
                    city.getImgUrl(),
                    flightAndHotel + localLivingCost,
                    dangerLabel,
                    dangerDescription,
                    city.getLat(),
                    city.getLon()
            ));
        }
        return result;
    }

    private Map<Long, Danger> getDangerByCountryId(List<City> cities) {
        List<Long> countryIds = cities.stream()
                .map(city -> city.getCountry().getId())
                .distinct()
                .toList();

        return dangerRepository.findAllByCountryIdIn(countryIds).stream()
                .collect(Collectors.toMap(danger -> danger.getCountry().getId(), Function.identity()));
    }

    private String getDangerLabel(Danger danger) {
        if (hasText(danger.getControl())) {
            return danger.getControl().trim();
        }
        if (hasText(danger.getAttention())) {
            return danger.getAttention().trim();
        }
        if (hasText(danger.getLimita())) {
            return danger.getLimita().trim();
        }
        return DEFAULT_DANGER_LABEL;
    }

    private String getDangerDescription(Danger danger) {
        if (hasText(danger.getControl())) {
            return joinDangerDescription(
                    danger.getControlNote(),
                    danger.getControlPartial(),
                    danger.getEvacuateRegionTy()
            );
        }
        if (hasText(danger.getAttention())) {
            return joinDangerDescription(
                    danger.getAttentionNote(),
                    danger.getAttentionPartial()
            );
        }
        if (hasText(danger.getLimita())) {
            return joinDangerDescription(
                    danger.getLimitaNote(),
                    danger.getLimitaPartial(),
                    danger.getEvacuateRcmndRemark()
            );
        }
        return null;
    }

    private String joinDangerDescription(String... parts) {
        String description = java.util.Arrays.stream(parts)
                .filter(this::hasText)
                .map(String::trim)
                .collect(Collectors.joining(" / "));
        return description.isBlank() ? null : description;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    public RecommendCityDetailResponse getRecommendCityDetail(Long id) {
        return null;
    }

    public NotRecommendCityDetailResponse getNotRecommendCityDetail(Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도시는 존재하지 않습니다."));
        YearMonth now = YearMonth.now();
        String targetYearMonth = YearMonth.of(now.getYear(), now.getMonth()).toString();
        FlightSummary summary = flightSummaryRepository.findByCityIdAndYearMonthWithCity(id, targetYearMonth).orElse(null);
        double avgFlightPrice = 0.0;
        double avgHotelPrice = 0.0;
        if (summary != null) {
            avgFlightPrice = summary.getAvgFlightPrice() != null ? summary.getAvgFlightPrice() : 0.0;
            avgHotelPrice = summary.getAvgHotelPrice() != null ? summary.getAvgHotelPrice() : 0.0;
        }

        double food = 0.0;
        double transport = 0.0;
        LivingCostOfCity cost = livingCostOfCityRepository.findOneByCityId(id).orElse(null);
        if (cost != null) {
            transport = cost.getTransport() != null ? cost.getTransport() : 0.0;
            food = cost.getFood() != null ? cost.getFood() : 0.0;
        }

        String dangerLabel = DEFAULT_DANGER_LABEL;
        String dangerDescription = null;
        Danger danger = dangerRepository.findByCountryId(city.getCountry().getId()).orElse(null);
        if (danger != null) {
            dangerLabel = getDangerLabel(danger);
            dangerDescription = getDangerDescription(danger);
        }

        List<NotRecommendCityDetailResponse.TagResponse> list =
                cityTagRepository.findCityTagsByCityId(id).stream()
                        .map(cityTag -> new NotRecommendCityDetailResponse.TagResponse(
                                cityTag.getTag().getName(),
                                cityTag.getTagScore()
                        ))
                        .toList();

        return new NotRecommendCityDetailResponse(
                city.getCityName(),
                new NotRecommendCityDetailResponse.LivingCostFor1Day(food, transport),
                new NotRecommendCityDetailResponse.AirTicketAndHotel(avgFlightPrice, avgHotelPrice),
                dangerLabel,
                dangerDescription,
                list
        );
    }

    public List<CityResponse> list(Long countryId) {
        if (countryId == null) {
            List<City> cities = cityRepository.findAllByIsDeletedFalse();
            return parseToCityListResponseList(cities);
        } else {
            List<City> cities = cityRepository.findAllByCountryIdAndIsDeletedFalse(countryId);
            return parseToCityListResponseList(cities);
        }
    }

    private List<CityResponse> parseToCityListResponseList(List<City> cities) {
        return cities.stream()
                .map(CityResponse::from)
                .toList();
    }
}
