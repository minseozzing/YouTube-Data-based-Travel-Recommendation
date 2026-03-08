package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeLikedVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YouTubeLikedVideoRepository extends JpaRepository<YouTubeLikedVideo, Long> {
    boolean existsByAccountIdAndVideoId(Long accountId, Long videoId);
    List<YouTubeLikedVideo> findByAccountId(Long accountId);
}