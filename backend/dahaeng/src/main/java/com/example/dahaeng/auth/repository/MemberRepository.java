package com.example.dahaeng.auth.repository;

import com.example.dahaeng.auth.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Member findBySocialId(String socialId);
}
