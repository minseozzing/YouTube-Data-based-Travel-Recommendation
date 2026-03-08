package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubePlaylistVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YouTubePlaylistVideoRepository extends JpaRepository<YouTubePlaylistVideo, Long> {
    boolean existsByPlaylistIdAndVideoId(Long playlistId, Long videoId);
    List<YouTubePlaylistVideo> findByPlaylistId(Long playlistId);
}