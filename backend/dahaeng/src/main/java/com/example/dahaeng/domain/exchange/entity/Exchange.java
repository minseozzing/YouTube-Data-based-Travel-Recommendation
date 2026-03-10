package com.example.dahaeng.domain.location.exchange.entity;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.dahaeng.domain.location.exchange.enums.Currency;
import com.example.dahaeng.global.entity.BaseEntity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "exchange")
public class Exchange extends BaseEntity {

	@Id
	@Enumerated(EnumType.STRING)
	private Currency currency;

	@Column(name = "display_unit")
	private Integer displayUnit;

	@Enumerated(EnumType.STRING)
	@Column(name = "display_symbol")
	private Currency displaySymbol;

	@Column(name = "rate_1krw_to_cur")
	private Double rate1krwToCur;

	@Column(name = "krw_per_1cur")
	private Double krwPer1cur;

	@Column(name = "krw_per_display_unit")
	private Double krwPerDisplayUnit;

	@Column(name = "event_date")
	private LocalDate eventDate;
}
