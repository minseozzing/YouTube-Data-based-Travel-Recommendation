package com.example.dahaeng.domain.interest.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TravelTagScore {
    private String tag;
    private String category;
    private Double score;
    private Double confidence;
    private String reason;
}
