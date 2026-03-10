package com.example.dahaeng.domain.flight.service;

import com.example.dahaeng.domain.flight.document.FlightPriceCalendar;
import com.example.dahaeng.domain.flight.dto.CalendarResponseDto;
import com.example.dahaeng.domain.flight.dto.CitySummaryResponseDto;
import com.example.dahaeng.domain.flight.dto.TrendResponseDto;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.flight.entity.FlightSummary;
import com.example.dahaeng.domain.flight.repository.FlightPriceCalendarRepository;
import com.example.dahaeng.domain.flight.repository.FlightSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlightService {

    private final FlightSummaryRepository flightSummaryRepository;
    private final FlightPriceCalendarRepository flightPriceCalendarRepository;

    public CalendarResponseDto getCalendarWithHistory(Long cityId, String yearMonth) {
        List<FlightPriceCalendar> calendars = flightPriceCalendarRepository
                .findByCityIdAndYearMonthOrderByCollectedDateDesc(cityId, yearMonth, PageRequest.of(0, 15));

        if (calendars.isEmpty()) {
            return CalendarResponseDto.builder()
                    .cityId(cityId)
                    .yearMonth(yearMonth)
                    .updatedAt(null)
                    .outboundDailyPrices(Collections.emptyList())
                    .inboundDailyPrices(Collections.emptyList())
                    .build();
        }

        FlightPriceCalendar latest = calendars.get(0);
        List<CalendarResponseDto.DailyPriceDto> outbound = buildDailyPricesWithHistory(calendars, true);
        List<CalendarResponseDto.DailyPriceDto> inbound = buildDailyPricesWithHistory(calendars, false);

        return CalendarResponseDto.builder()
                .cityId(cityId)
                .yearMonth(yearMonth)
                .updatedAt(latest.getCollectedDate() + "T00:00:00Z")
                .outboundDailyPrices(outbound)
                .inboundDailyPrices(inbound)
                .build();
    }

    private List<CalendarResponseDto.DailyPriceDto> buildDailyPricesWithHistory(List<FlightPriceCalendar> calendars,
            boolean isOutbound) {
        FlightPriceCalendar latest = calendars.get(0);
        List<FlightPriceCalendar.DailyPrice> basePrices = isOutbound ? latest.getOutboundDailyPrices()
                : latest.getInboundDailyPrices();

        if (basePrices == null)
            return Collections.emptyList();

        List<CalendarResponseDto.DailyPriceDto> result = new ArrayList<>();
        LocalDate latestDateParsed = LocalDate.parse(latest.getCollectedDate());

        for (int i = 0; i < basePrices.size(); i++) {
            FlightPriceCalendar.DailyPrice daily = basePrices.get(i);
            String date = daily.getDate();
            Integer currentPrice = daily.getPrice();

            List<CalendarResponseDto.PriceHistoryDto> history = new ArrayList<>();
            for (FlightPriceCalendar cal : calendars) {
                List<FlightPriceCalendar.DailyPrice> targetPrices = isOutbound ? cal.getOutboundDailyPrices()
                        : cal.getInboundDailyPrices();
                if (targetPrices != null && i < targetPrices.size() && targetPrices.get(i).getDate().equals(date)) {
                    LocalDate targetParsed = LocalDate.parse(cal.getCollectedDate());
                    long daysDiff = ChronoUnit.DAYS.between(targetParsed, latestDateParsed);

                    history.add(CalendarResponseDto.PriceHistoryDto.builder()
                            .collectedDate(cal.getCollectedDate())
                            .price(targetPrices.get(i).getPrice())
                            .label(determineLabel(daysDiff))
                            .build());
                }
            }

            result.add(CalendarResponseDto.DailyPriceDto.builder()
                    .date(date)
                    .price(currentPrice)
                    .history(history)
                    .build());
        }
        return result;
    }

    private String determineLabel(long daysDiff) {
        if (daysDiff == 0)
            return "오늘";
        if (daysDiff == 1)
            return "어제";
        if (daysDiff >= 7 && daysDiff < 14)
            return "1주 전";
        if (daysDiff >= 14)
            return "2주 전";
        return daysDiff + "일 전";
    }

    public TrendResponseDto getSixMonthTrend(Long cityId) {
        String currentYearMonth = YearMonth.now().toString();

        List<FlightSummary> summaries = flightSummaryRepository
                .findByCityIdAndYearMonthGreaterThanEqualOrderByYearMonthAsc(
                        cityId, currentYearMonth, PageRequest.of(0, 6));

        List<TrendResponseDto.MonthlyTrendDto> trendData = summaries.stream()
                .map(s -> TrendResponseDto.MonthlyTrendDto.builder()
                        .yearMonth(s.getYearMonth())
                        .avgFlightPrice(s.getAvgFlightPrice())
                        .avgHotelPrice(s.getAvgHotelPrice())
                        .build())
                .collect(Collectors.toList());

        return TrendResponseDto.builder()
                .cityId(cityId)
                .trendData(trendData)
                .build();
    }

    public CitySummaryResponseDto getCitySummary(Long cityId, String yearMonth) {
        Optional<FlightSummary> summaryOpt = flightSummaryRepository.findByCityIdAndYearMonthWithCity(cityId,
                yearMonth);

        if (summaryOpt.isEmpty()) {
            return CitySummaryResponseDto.builder()
                    .cityId(cityId)
                    .build();
        }

        FlightSummary summary = summaryOpt.get();
        City city = summary.getCity();

        // New DDD City entity adaptation
        return CitySummaryResponseDto.builder()
                .cityId(cityId)
                .cityNameKr(city.getCityName()) // Using cityName from new entity
                .cityNameEn(city.getCityName()) // Temporary fallback
                .countryNameKr(city.getCountry() != null ? city.getCountry().getCountryName() : "") // Fallback to new
                                                                                                    // logic
                .cityImageUrl(city.getImgUrl()) // New entity field
                .avgFlightPrice(summary.getAvgFlightPrice())
                .avgHotelPrice(summary.getAvgHotelPrice())
                .typicalStopsText(summary.getStops() == null || summary.getStops() == 0 ? "직항"
                        : "경유 " + summary.getStops() + "회")
                .avgDurationText(formatDuration(summary.getFlightDuration()))
                .peakSeasonMonths(parseMonthList(summary.getPeakMonthList()))
                .offSeasonMonths(parseMonthList(summary.getOffMonthList()))
                .build();
    }

    private String formatDuration(Integer minutes) {
        if (minutes == null)
            return "-";
        int h = minutes / 60;
        int m = minutes % 60;
        return h + "시간 " + m + "분";
    }

    private List<Integer> parseMonthList(String monthListStr) {
        if (monthListStr == null || monthListStr.isBlank())
            return Collections.emptyList();
        return Arrays.stream(monthListStr.split(","))
                .map(String::trim)
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
}
