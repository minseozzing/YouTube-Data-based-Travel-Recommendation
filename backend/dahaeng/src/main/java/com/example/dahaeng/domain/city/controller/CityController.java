package com.example.dahaeng.domain.city.controller;

import com.example.dahaeng.domain.city.dto.response.AllCitiesResponse;
import com.example.dahaeng.domain.city.dto.response.NotRecommendCityDetailResponse;
import com.example.dahaeng.domain.city.dto.response.RecommendCityDetailResponse;
import com.example.dahaeng.domain.city.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CityController {
    private final CityService cityService;

    @GetMapping("/city")
    public ResponseEntity<List<AllCitiesResponse>> getCities() {
        List<AllCitiesResponse> list = new ArrayList<>();
        list = cityService.getAllCities();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/city/{id}")
    public ResponseEntity<?> getCityDetail(
            @PathVariable Long id,
            @RequestParam Boolean recommend
    ){
        if(recommend){
            RecommendCityDetailResponse recommendCityDetailResponse = cityService.getRecommendCityDetail(id);
            return ResponseEntity.ok(recommendCityDetailResponse);
        } else {
            NotRecommendCityDetailResponse notRecommendCityDetailResponse = cityService.getNotRecommendCityDetail(id);
            return ResponseEntity.ok(notRecommendCityDetailResponse);
        }
    }


}
