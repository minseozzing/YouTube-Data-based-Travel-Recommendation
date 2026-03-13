package com.example.dahaeng.domain.city.service;

import com.example.dahaeng.domain.city.dto.response.AllCitiesResponse;
import com.example.dahaeng.domain.city.dto.response.CityResponse;
import com.example.dahaeng.domain.city.dto.response.NotRecommendCityDetailResponse;
import com.example.dahaeng.domain.city.dto.response.RecommendCityDetailResponse;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.enums.CityEnum;
import com.example.dahaeng.domain.city.repository.CityRepository;
import com.example.dahaeng.domain.city.repository.CityTagRepository;
import com.example.dahaeng.domain.country.entity.Danger;
import com.example.dahaeng.domain.country.repository.DangerRepository;
import com.example.dahaeng.domain.country.service.DangerService;
import com.example.dahaeng.domain.flight.entity.FlightSummary;
import com.example.dahaeng.domain.flight.repository.FlightSummaryRepository;
import com.example.dahaeng.domain.livingcost.entity.LivingCostOfCity;
import com.example.dahaeng.domain.livingcost.repository.LivingCostOfCityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CityService {
    private final CityRepository cityRepository;
    private final FlightSummaryRepository flightSummaryRepository;
    private final LivingCostOfCityRepository livingCostOfCityRepository;
    private final DangerRepository dangerRepository;
    private final CityTagRepository cityTagRepository;
    private final DangerService dangerService;

    public List<AllCitiesResponse> getAllCities() {
        YearMonth now = YearMonth.now();
        String targetYearMonth = YearMonth.of(now.getYear(), now.getMonth()).toString();
        System.out.println(targetYearMonth);
        List<City> cities = cityRepository.findAll();
        List<AllCitiesResponse> result = new ArrayList<>();

        for (City city : cities) {
            double flightAndHotel = 0.0;

            FlightSummary summary = flightSummaryRepository.findByCityIdAndYearMonthWithCity(city.getId(),
                targetYearMonth).orElse(null);
            if (summary != null) {
                double avgFlightPrice = summary.getAvgFlightPrice() != null ? summary.getAvgFlightPrice() : 0.0;
                double avgHotelPrice = summary.getAvgHotelPrice() != null ? summary.getAvgHotelPrice() : 0.0;
                flightAndHotel = avgFlightPrice + avgHotelPrice;
            }

            double localLivingCost = 0.0;
            LivingCostOfCity cost = livingCostOfCityRepository.findOneByCityId(city.getId()).orElse(null);

            if (cost != null) {
                double transport = cost.getTransport() != null ? cost.getTransport() : 0.0;
                double food = cost.getFood() != null ? cost.getFood() : 0;
                localLivingCost = transport + food;
            }

            if (cost != null && cost.getCity().getCityName().toLowerCase().equals(CityEnum.SEOUL.getCityName())) {
                continue;
            }

            AllCitiesResponse response = new AllCitiesResponse(
                city.getId(),
                city.getCityName(),
                city.getImgUrl(),
                flightAndHotel + localLivingCost,
                dangerService.dangers(city.getCountry().getId()),
                city.getLat(),
                city.getLon()
            );
            result.add(response);
        }
        return result;
    }

    public RecommendCityDetailResponse getRecommendCityDetail(Long id) {

        return null;
    }

    public NotRecommendCityDetailResponse getNotRecommendCityDetail(Long id) {
        City city = cityRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("도시가 존재하지 않습니다."));
        YearMonth now = YearMonth.now();
        String targetYearMonth = YearMonth.of(now.getYear(), now.getMonth()).toString();
        FlightSummary summary = flightSummaryRepository.findByCityIdAndYearMonthWithCity(id, targetYearMonth)
            .orElse(null);
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
            food = cost.getFood() != null ? cost.getFood() : 0;

        }

        List<NotRecommendCityDetailResponse.TagResponse> list =
            cityTagRepository.findCityTagsByCityId(id).stream()
                .map(cityTag -> new NotRecommendCityDetailResponse.TagResponse(
                    cityTag.getTag().getName(),
                    cityTag.getTagScore()
                ))
                .toList();
        ;

        return new NotRecommendCityDetailResponse(
            city.getId(),
            city.getCityName(),
            new NotRecommendCityDetailResponse.LivingCostFor1Day(food, transport),
            new NotRecommendCityDetailResponse.AirTicketAndHotel(avgFlightPrice, avgHotelPrice),
            dangerService.dangers(city.getCountry().getId()),
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
        return cities
            .stream()
            .map(CityResponse::from)
            .toList();
    }
}


