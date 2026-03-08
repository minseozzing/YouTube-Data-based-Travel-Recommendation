package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeSyncSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YouTubeSyncSnapshotRepository extends JpaRepository<YouTubeSyncSnapshot, Long> {
}