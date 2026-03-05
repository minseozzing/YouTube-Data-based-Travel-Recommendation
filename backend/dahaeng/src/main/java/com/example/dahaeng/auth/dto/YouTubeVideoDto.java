package com.example.dahaeng.auth.dto;

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
    private List<String> tags;
}
