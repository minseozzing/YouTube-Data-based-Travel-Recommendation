// [FILE_DELETE_CANDIDATE] - 사용하지 않는 엔티티
package com.example.dahaeng.domain.youtube.entity;

import com.example.dahaeng.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "youtube_interest")
public class YouTubeInterest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private YouTubeAccount account;

    @Column(name = "category_name", length = 50, nullable = false)
    private String categoryName;

    @Column(name = "score", nullable = false)
    private Double score;

    @Column(name = "rank_no")
    private Integer rankNo;

    @Column(name = "analysis_version", length = 50)
    private String analysisVersion;

    @Column(name = "analyzed_at", nullable = false)
    private LocalDateTime analyzedAt;
}