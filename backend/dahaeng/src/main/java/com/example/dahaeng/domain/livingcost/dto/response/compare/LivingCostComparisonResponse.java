package com.example.dahaeng.domain.livingcost.dto.response.compare;

import com.example.dahaeng.domain.livingcost.dto.response.detail.TargetResponse;

public record CostComparisonResponse(
	TargetResponse base,
	TargetResponse target,
	CostVsBaseResponse costCompare,
	ExpectedDailyBudgetResponse expectedDailyBudget,
	ItemComparisonResponse itemComparison
) {
}
