package com.example.dahaeng.domain.interest.dto;

import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestKeywordCandidate {
    private String rawKeyword;
    private String normalizedKeyword;
    private double totalScore;
    private Set<InterestSourceType> sourceTypes;
    private int totalCount;
    private int distinctSourceCount;
    private LocalDateTime latestSignalTime;
    private InterestSourceType sourceType;

    public double getScore() {
        return totalScore;
    }
}
