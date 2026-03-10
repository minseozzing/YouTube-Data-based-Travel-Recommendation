package com.example.dahaeng.domain.flight.document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "flight_price_calendar")
@Getter
@NoArgsConstructor
public class FlightPriceCalendar {
    @Id
    private String id; // e.g., "12-2026-05-20260309"

    @Field("city_id")
    private Long cityId;

    @Field("year_month")
    private String yearMonth;

    @Field("collected_date")
    private String collectedDate; // YYYY-MM-DD

    @Field("outbound_daily_prices")
    private List<DailyPrice> outboundDailyPrices;

    @Field("inbound_daily_prices")
    private List<DailyPrice> inboundDailyPrices;

    @Getter
    @NoArgsConstructor
    public static class DailyPrice {
        private String date;
        private Integer price;
    }
}
