package com.example.dahaeng.auth.dto;

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
    private List<YouTubeVideoDto> videos; // 재생목록 내 영상 목록
}
