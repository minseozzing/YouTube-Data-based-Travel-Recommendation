package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RawInterestSignal {
    private final String rawText;
    private final InterestSourceType sourceType;
    private final String videoId;
    private final String playlistId;
}