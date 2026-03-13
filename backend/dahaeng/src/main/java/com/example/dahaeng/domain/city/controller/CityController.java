package com.example.dahaeng.domain.city.controller;

import com.example.dahaeng.domain.city.dto.response.AllCitiesResponse;
import com.example.dahaeng.domain.city.dto.response.CityResponse;
import com.example.dahaeng.domain.city.dto.response.NotRecommendCityDetailResponse;
import com.example.dahaeng.domain.city.dto.response.RecommendCityDetailResponse;
import com.example.dahaeng.domain.city.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/city")
@RequiredArgsConstructor
public class CityController {
    private final CityService cityService;

    @GetMapping
    public ResponseEntity<List<AllCitiesResponse>> getAllCities() {
        List<AllCitiesResponse> list = new ArrayList<>();
        list = cityService.getAllCities();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCityDetail(
            @PathVariable("id") Long id,
            @RequestParam("recommend") Boolean recommend
    ){
        if(recommend){
            RecommendCityDetailResponse recommendCityDetailResponse = cityService.getRecommendCityDetail(id);
            return ResponseEntity.ok(recommendCityDetailResponse);
        } else {
            NotRecommendCityDetailResponse notRecommendCityDetailResponse = cityService.getNotRecommendCityDetail(id);
            return ResponseEntity.ok(notRecommendCityDetailResponse);
        }
    }

    @GetMapping("/list")
        public ResponseEntity<List<CityResponse>> list(@Param("countryId") Long countryId) {
            return ResponseEntity.ok(cityService.list(countryId));
        }
}



