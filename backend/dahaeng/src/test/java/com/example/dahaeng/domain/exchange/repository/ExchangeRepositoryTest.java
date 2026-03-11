package com.example.dahaeng.domain.exchange.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.dahaeng.domain.exchange.entity.Exchange;
import com.example.dahaeng.domain.exchange.enums.Currency;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class ExchangeRepositoryTest {
	@Autowired
	ExchangeRepository repository;

	@Test
	void findOne() {
		Exchange exchange = repository.findFirstByCurrencyOrderByEventDateDesc(Currency.USD).orElseThrow();

		Assertions.assertThat(exchange.getEventDate()).isEqualTo("2026-03-09");
	}

}