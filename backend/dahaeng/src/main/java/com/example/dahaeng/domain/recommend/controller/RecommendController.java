package com.example.dahaeng.domain.recommend.controller;

import com.example.dahaeng.domain.recommend.Service.RecommendFacade;
import com.example.dahaeng.domain.recommend.dto.request.RecommendCitiesRequest;
import com.example.dahaeng.domain.recommend.dto.response.RecommendCitiesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private final RecommendFacade recommendFacade;
    @PostMapping
    public RecommendCitiesResponse getRecommendCities(@RequestBody RecommendCitiesRequest request){
    return recommendFacade.recommend(request);
    }
}
