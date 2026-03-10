package com.example.dahaeng.youtube.repository;

import com.example.dahaeng.youtube.entity.YouTubeSyncSnapshot;
import com.example.dahaeng.youtube.enums.SnapshotType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YouTubeSyncSnapshotRepository extends JpaRepository<YouTubeSyncSnapshot, Long> {
    void deleteByAccountIdAndSnapshotType(Long accountId, SnapshotType snapshotType);
}