package com.example.dahaeng.domain.location.country.entity;

import com.example.dahaeng.domain.location.country.enums.Continent;
import com.example.dahaeng.domain.location.exchange.enums.Currency;
import com.example.dahaeng.global.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "country")
public class Country extends BaseEntity {

	@Id
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Currency currency;

	@Column(name = "country_name", length = 50)
	private String countryName;

	@Enumerated(EnumType.STRING)
	private Continent continent;

	@Column(name = "img_url", columnDefinition = "TEXT")
	private String imgUrl;

	@Column(name = "is_deleted")
	private Boolean isDeleted;

	private Double lat;
	private Double lng;
}
