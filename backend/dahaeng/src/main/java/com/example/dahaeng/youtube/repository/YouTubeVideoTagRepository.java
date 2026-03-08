package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeVideoTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface YouTubeVideoTagRepository extends JpaRepository<YouTubeVideoTag, Long> {
    boolean existsByVideoIdAndTagName(Long videoId, String tagName);

    @Query("select t.tagName from YouTubeVideoTag t where t.video.id = :videoId")
    List<String> findTagNamesByVideoId(@Param("videoId") Long videoId);
}