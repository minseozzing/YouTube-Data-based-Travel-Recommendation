package com.example.dahaeng.domain.recommend.Service;

import com.example.dahaeng.domain.place.repository.SpotTagRepository;
import com.example.dahaeng.domain.recommend.dto.request.RecommendCitiesRequest;
import com.example.dahaeng.domain.recommend.dto.response.RecommendCitiesResponse;
import com.example.dahaeng.domain.recommend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendFacade {

    private final RecommendQueryRepository recommendQueryRepository;
    private final SpotTagRepository spotTagRepository;
    private final TouristSpotRecommendRepository touristSpotRecommendRepository;
    private final NewsSearchService newsSearchService;
    private final RecommendationNarrationService narrationService;
    private final PlaceEnrichmentService placeEnrichmentService;

    public RecommendCitiesResponse recommend(RecommendCitiesRequest request) {
        String yearMonth = YearMonth.of(YearMonth.now().getYear(), request.month()).toString();
        double totalBudget = request.userDailyBudget() * request.travelDays();

        Map<Long, CityTagAggregateProjection> tagMap =
                spotTagRepository.aggregateCityTagScores(request.selectedTags())
                        .stream()
                        .collect(Collectors.toMap(CityTagAggregateProjection::getCityId, Function.identity()));

        List<CityRankResult> topCities = recommendQueryRepository.findCityCandidates(yearMonth).stream()
                .map(city -> score(city, tagMap.get(city.getCityId()), request.travelDays(), totalBudget))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(CityRankResult::totalScore).reversed())
                .limit(3)
                .toList();

        Map<Long, List<RecommendCitiesResponse.RecommendedPlace>> placeMap = buildPlaces(
                topCities.stream().map(CityRankResult::cityId).toList(),
                request.selectedTags()
        );

        List<RecommendCitiesResponse.RecommendationItem> items = new ArrayList<>();
        for (int i = 0; i < topCities.size(); i++) {
            CityRankResult city = topCities.get(i);
            List<RecommendCitiesResponse.RecommendedPlace> places = placeMap.getOrDefault(city.cityId(), List.of());
            RecommendCitiesResponse.NewsInsight news =
                    newsSearchService.searchAndSummarize(city.cityName(), city.countryName(), city.newsPenaltyScore());
            String reason = narrationService.generateReason(city, places, request.selectedTags(), news.summary());

            items.add(new RecommendCitiesResponse.RecommendationItem(
                    i + 1,
                    city.countryName(),
                    city.cityName(),
                    new RecommendCitiesResponse.Scores(
                            round(city.totalScore()),
                            round(city.budgetScore()),
                            round(city.safetyScore()),
                            round(city.tagScore()),
                            round(city.newsPenaltyScore())
                    ),
                    reason,
                    new RecommendCitiesResponse.PriceInfo(
                            city.currency(),
                            city.hotelPerDay().doubleValue(),
                            city.dailyLocalCost().doubleValue()
                    ),
                    new RecommendCitiesResponse.FlightInfo(
                            "ICN",
                            city.originAirport(),
                            city.flightPrice(),
                            null
                    ),
                    news,
                    places
            ));
        }

        return new RecommendCitiesResponse("success", new RecommendCitiesResponse.Data(items));
    }

    private CityRankResult score(CityCandidateProjection city, CityTagAggregateProjection tagAgg, int travelDays, double totalBudget) {
        if (isExcludedByDanger(city)) return null;

        double flight = nz(city.getAvgFlightPrice());
        double hotelPerDay = nz(city.getAvgHotelPrice());
        double food = nz(city.getFoodCost());
        double transport = nz(city.getTransportCost());
        double dailyLocal = food + transport;
        double expectedTotalCost = flight + ((hotelPerDay + dailyLocal) * travelDays);

        if (expectedTotalCost > totalBudget * 1.3) return null;

        double tagRaw = 0.0;
        if (tagAgg != null && tagAgg.getMatchedSpotCount() != null && tagAgg.getMatchedSpotCount() > 0) {
            tagRaw = nz(tagAgg.getMatchedScoreSum()) / tagAgg.getMatchedSpotCount();
        }

        double tagScore = Math.min(55.0, tagRaw * 55.0);

        double ratio = (totalBudget - expectedTotalCost) / totalBudget;
        double budgetScore = ratio >= 0
                ? Math.min(25.0, ratio * 25.0)
                : Math.max(-25.0, (ratio / 0.3) * 25.0);

        double safetyScore = hasText(city.getDangerAttention()) ? 7.5 : 15.0;
        double newsPenalty = -Math.min(15.0, Math.max(0.0, nz(city.getNewsPenaltyScore())));
        double totalScore = clamp(tagScore + budgetScore + safetyScore + newsPenalty, 0.0, 100.0);

        return new CityRankResult(
                city.getCityId(),
                city.getCountryName(),
                city.getCityName(),
                totalScore,
                budgetScore,
                safetyScore,
                tagScore,
                newsPenalty,
                city.getCurrency(),
                hotelPerDay,
                dailyLocal,
                city.getOriginAirport(),
                (int) flight,
                city.getDescription(),
                city.getLat(),
                city.getLon()
        );
    }

    private Map<Long, List<RecommendCitiesResponse.RecommendedPlace>> buildPlaces(List<Long> cityIds, List<String> selectedTags) {
        Map<Long, List<RecommendCitiesResponse.RecommendedPlace>> result = new HashMap<>();
        if (cityIds.isEmpty()) return result;

        List<SpotRecommendationProjection> candidates =
                touristSpotRecommendRepository.findSpotCandidates(cityIds, selectedTags);

        Map<Long, List<SpotRecommendationProjection>> topSpotMap = new LinkedHashMap<>();
        for (SpotRecommendationProjection spot : candidates) {
            topSpotMap.computeIfAbsent(spot.getCityId(), k -> new ArrayList<>());
            if (topSpotMap.get(spot.getCityId()).size() < 5) {
                topSpotMap.get(spot.getCityId()).add(spot);
            }
        }

        List<Long> spotIds = topSpotMap.values().stream()
                .flatMap(List::stream)
                .map(SpotRecommendationProjection::getSpotId)
                .toList();

        Map<Long, Map<String, Double>> tagScoreMap = new HashMap<>();
        for (SpotTagScoreProjection row : spotTagRepository.findTagScoresBySpotIds(spotIds, selectedTags)) {
            tagScoreMap
                    .computeIfAbsent(row.getSpotId(), k -> new LinkedHashMap<>())
                    .put(row.getTagName(), row.getScore());
        }

        for (Map.Entry<Long, List<SpotRecommendationProjection>> entry : topSpotMap.entrySet()) {
            Long cityId = entry.getKey();
            List<RecommendCitiesResponse.RecommendedPlace> places = new ArrayList<>();

            for (SpotRecommendationProjection spot : entry.getValue()) {
                Map<String, Double> scores = new LinkedHashMap<>();
                for (String selectedTag : selectedTags) {
                    scores.put(selectedTag, 0.0);
                }
                scores.putAll(tagScoreMap.getOrDefault(spot.getSpotId(), Map.of()));

                places.add(placeEnrichmentService.enrich(spot, selectedTags, scores));
            }

            result.put(cityId, places);
        }

        return result;
    }


    private boolean isExcludedByDanger(CityCandidateProjection city) {
        return hasText(city.getDangerControl()) || hasText(city.getDangerLimita());
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private double nz(Number value) {
        return value == null ? 0.0 : value.doubleValue();
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
