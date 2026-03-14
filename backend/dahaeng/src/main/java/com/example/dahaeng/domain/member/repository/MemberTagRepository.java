package com.example.dahaeng.domain.member.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.domain.member.entity.MemberTag;
import com.example.dahaeng.domain.tag.entity.Tag;

public interface MemberTagRepository extends JpaRepository<MemberTag, Long> {
	@Query(
		"""
		select mt
		from MemberTag mt join fetch mt.tag
		where mt.member = :member
				and mt.isDeleted = false
		order by mt.updatedAt
		"""
	)
	List<MemberTag> findAllByMember(@Param("member") Member member);

	@Query(
		"""
		select mt
		from MemberTag mt join fetch mt.tag
		where mt.tag in (:tags)
				and mt.member = :member
				and mt.isDeleted = false
		"""
	)
	List<MemberTag> findAllExists(@Param("tags") List<Tag> tags, @Param("member") Member member);

	@Query(
		"""
		select mt
		from MemberTag mt join fetch mt.tag
		where mt.member = :member
				and mt.isFromYoutube = true
				and mt.isDeleted = false
		"""
	)
	List<MemberTag> findAllYoutubeTagsByMember(@Param("member") Member member);

	@Modifying
	void deleteByMemberAndIsFromYoutubeTrue(Member member);

	Optional<MemberTag> findByIdAndMemberAndIsDeletedFalse(
		@Param("id") Long id,
		@Param("member") Member member
	);
}
