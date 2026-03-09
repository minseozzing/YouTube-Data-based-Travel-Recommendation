package com.example.dahaeng.domain.livingcost.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EatingOutResponse(
	Double lunchMenu,
	Double dinnerInAResturantFor2,
	Double fastFoodMeal,
	Double beerInAPub,
	Double cappuccino,
	Double cokePepsi
) {
}