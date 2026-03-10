package com.example.dahaeng.domain.bookmark.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.dahaeng.domain.bookmark.entity.Bookmark;
import com.example.dahaeng.domain.member.entity.Member;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
	Optional<Bookmark> findFirstByIdAndMemberAndIsDeletedFalse(Long id, Member member);

	@Query("""
    select b
    from Bookmark b
    where (b.city.cityName like concat('%', :keyword, '%')
       or b.city.country.countryName like concat('%', :keyword, '%')
       or b.json like concat('%', :keyword, '%')) 
	       and b.member = :member
	       and b.isDeleted = false
	""")
	List<Bookmark> findAllByKeywordAndMember(@Param("keyword") String keyword, @Param("member") Member member);
}
