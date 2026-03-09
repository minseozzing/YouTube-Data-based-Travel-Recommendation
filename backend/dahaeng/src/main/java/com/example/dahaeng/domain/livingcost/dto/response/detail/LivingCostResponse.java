package com.example.dahaeng.domain.livingcost.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record LivingCostResponse(
	Long id,
	Double dailyBudget,
	Double withoutRent,
	Double food,
	Double transport,
	Double monthlySalaryAfterTax,
	Double population,
	EatingOutResponse eatingOut,
	TransportationResponse transportation,
	GroceriesResponse groceries,
	OtherResponse other,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}

