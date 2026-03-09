package com.example.dahaeng.domain.livingcost.dto.response;
import com.fasterxml.jackson.annotation.JsonProperty;

public record TransportationResponse(
	Double localTransportTicket,
	Double monthlyTicketLocalTransport,
	Double taxiRide,
	Double gasPetrol
) {
}