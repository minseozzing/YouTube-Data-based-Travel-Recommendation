package com.example.dahaeng.domain.city.controller;

import com.example.dahaeng.domain.city.dto.response.AllCitiesResponse;
import com.example.dahaeng.domain.city.dto.response.CityDetailResponse;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<CityDetailResponse> getCityDetail(){
        CityDetailResponse cityDetailResponse = null;
        return ResponseEntity.ok(cityDetailResponse);
    }


}
