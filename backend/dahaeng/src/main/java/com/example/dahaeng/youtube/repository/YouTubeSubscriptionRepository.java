package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YouTubeSubscriptionRepository extends JpaRepository<YouTubeSubscription, Long> {
    List<YouTubeSubscription> findByAccountId(Long accountId);
    void deleteByAccountId(Long accountId);
}