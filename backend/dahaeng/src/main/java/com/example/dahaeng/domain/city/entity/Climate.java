package com.example.dahaeng.domain.location.city.entity;

import com.example.dahaeng.global.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "climate")
public class Climate extends BaseEntity {

	@Id
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "city_id", nullable = false)
	private City city;

	@Column(name = "month")
	private Integer month;

	private Double temperature;

	@Column(name = "humidity")
	private Double humidity;

	private Double snowfall;
	private Double precipitation;
}