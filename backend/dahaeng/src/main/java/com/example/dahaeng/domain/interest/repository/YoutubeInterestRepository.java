package com.example.dahaeng.interest.repository;

import com.example.dahaeng.youtube.entity.YouTubeInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeInterestRepository extends JpaRepository<YouTubeInterest, Long> {
    void deleteByAccount_Id(Long accountId);
}