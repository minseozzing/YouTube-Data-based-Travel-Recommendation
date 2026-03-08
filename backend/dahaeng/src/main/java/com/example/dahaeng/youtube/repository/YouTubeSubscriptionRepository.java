package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface YouTubeSubscriptionRepository extends JpaRepository<YouTubeSubscription, Long> {
    List<YouTubeSubscription> findByAccountId(Long accountId);
    Optional<YouTubeSubscription> findByAccountIdAndYoutubeChannelId(Long accountId, String youtubeChannelId);
}