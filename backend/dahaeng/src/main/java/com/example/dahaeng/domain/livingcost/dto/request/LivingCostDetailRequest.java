package com.example.dahaeng.domain.livingcost.dto;

import com.example.dahaeng.domain.livingcost.enums.TargetType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LivingCostDetailRequest {
	private TargetType targetType;
	private Long targetId;

	public TargetType getTargetType() {
		return targetType;
	}

	public void setTargetType(TargetType targetType) {
		this.targetType = targetType;
	}

	public Long getTargetId() {
		return targetId;
	}

	public void setTargetId(Long targetId) {
		this.targetId = targetId;
	}
}
