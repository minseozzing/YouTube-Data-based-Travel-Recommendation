package com.example.dahaeng.member.repository;

import com.example.dahaeng.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Member findBySocialId(String socialId);
}
