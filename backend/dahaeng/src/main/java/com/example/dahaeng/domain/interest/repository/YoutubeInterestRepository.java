// [FILE_DELETE_CANDIDATE] - 사용하지 않는 레포지토리
package com.example.dahaeng.domain.interest.repository;

import com.example.dahaeng.domain.youtube.entity.YouTubeInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeInterestRepository extends JpaRepository<YouTubeInterest, Long> {
    void deleteByAccount_Id(Long accountId);
}