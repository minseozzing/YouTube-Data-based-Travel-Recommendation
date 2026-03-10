package com.example.dahaeng.domain.bookmark.entity;

import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.member.entity.Member;
import com.example.dahaeng.global.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookmark")
public class Bookmark extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "city_id", nullable = false)
	private City city;

	@Column(columnDefinition = "TEXT")
	private String content;
}
