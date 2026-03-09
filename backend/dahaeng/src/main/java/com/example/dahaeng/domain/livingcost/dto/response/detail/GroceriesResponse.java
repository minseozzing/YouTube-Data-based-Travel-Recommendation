package com.example.dahaeng.domain.livingcost.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public record GroceriesResponse(
	Double milk,
	Double bread,
	Double rice,
	Double egg,
	Double chicken,
	Double steak,
	Double apple,
	Double banana,
	Double orange,
	Double tomato,
	Double potato,
	Double onion,
	Double water,
	Double coke,
	Double wine,
	Double beer,
	Double cigarette,
	Double coldMedicine,
	Double shampoo,
	Double toiletPaper,
	Double toothpaste
) {
}
