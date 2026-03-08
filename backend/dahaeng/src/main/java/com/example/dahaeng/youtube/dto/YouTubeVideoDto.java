package com.example.dahaeng.youtube.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeVideoDto {
    private String id;
    private String title;
    private String channelTitle; // 채널�?
    private String categoryId;   // 카테고리 ID
    private List<String> tags;   // ?�상 ?�그 리스??
}
