package com.example.dahaeng.domain.livingcost.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OtherResponse(
	Double gymMonth,
	Double cinemaTicket,
	Double haircut,
	Double brandJeans,
	Double brandSneakers
) {
}