package com.example.dahaeng.interest.dto;

import com.example.dahaeng.interest.enums.InterestSourceType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawInterestSignal {
    private String rawText;
    private InterestSourceType sourceType;
    private String videoId;
    private String playlistId;
    private LocalDateTime signalTime;
}
