package com.example.dahaeng.domain.livingcost.dto.request;

import com.example.dahaeng.domain.livingcost.enums.TargetType;

public record LivingCostCompareRequest (
	TargetType targetType,
	Long base_id,
	Long target_id
){
}
