package com.example.dahaeng.interest.repository;

import com.example.dahaeng.youtube.entity.YouTubeInterestKeyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeInterestKeywordRepository extends JpaRepository<YouTubeInterestKeyword, Long> {
    void deleteByAccount_Id(Long accountId);
}