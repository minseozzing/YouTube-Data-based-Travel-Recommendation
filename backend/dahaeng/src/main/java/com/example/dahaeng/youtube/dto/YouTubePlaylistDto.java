package com.example.dahaeng.youtube.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubePlaylistDto {
    private String id;
    private String title;
    private List<YouTubeVideoDto> videos; // ?�생목록 ???�상 목록
}
