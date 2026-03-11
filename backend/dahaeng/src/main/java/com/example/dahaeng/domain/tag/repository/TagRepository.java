package com.example.dahaeng.domain.tag.repository;

import com.example.dahaeng.domain.tag.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    // 활성화된 태그만 조회 (AI 분석 대상 태그 구분용 필드가 있다면 사용)
    // List<Tag> findByIsActiveTrue();
}
