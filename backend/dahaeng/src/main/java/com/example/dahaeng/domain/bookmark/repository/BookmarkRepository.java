package com.example.dahaeng.domain.bookmark.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.dahaeng.domain.bookmark.entity.Bookmark;
import com.example.dahaeng.domain.member.entity.Member;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
	Optional<Bookmark> findFirstByIdAndMemberAndIsDeletedFalse(Long id, Member member);

	@Query(    value = """
        select b
        from Bookmark b
        where (
            :keyword is null
            or trim(:keyword) = ''
            or b.city.cityName like concat('%', :keyword, '%')
            or b.city.country.countryName like concat('%', :keyword, '%')
            or b.json like concat('%', :keyword, '%')
        )
        and b.member = :member
        and b.isDeleted = false
    """,
		countQuery = """
        select count(b)
        from Bookmark b
        where (
            :keyword is null
            or trim(:keyword) = ''
            or b.city.cityName like concat('%', :keyword, '%')
            or b.city.country.countryName like concat('%', :keyword, '%')
            or b.json like concat('%', :keyword, '%')
        )
        and b.member = :member
        and b.isDeleted = false
    """)
	Page<Bookmark> findAllByKeywordAndMember(@Param("keyword") String keyword, @Param("member") Member member, Pageable pageable);
}
