package com.example.dahaeng.domain.interest.repository;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Repository
public class RawSignalRepository {

    @PersistenceContext
    private EntityManager em;

    public List<String> findPlaylistTitles(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubePlaylist, account, title 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select p.title from YouTubePlaylist p where p.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }

    public List<String> findPlaylistVideoTitles(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubePlaylistVideo, video, playlist, title 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select v.title from YouTubePlaylistVideo pv join pv.video v join pv.playlist p where p.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }

    public List<String> findPlaylistVideoTags(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubeVideoTag, tagName, video 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select t.tagName from YouTubePlaylistVideo pv join pv.video v join YouTubeVideoTag t on t.video.id = v.id join pv.playlist p where p.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }

    public List<String> findLikedVideoTitles(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubeLikedVideo, video, title 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select v.title from YouTubeLikedVideo lv join lv.video v where lv.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }

    public List<String> findLikedVideoTags(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubeVideoTag, tagName, video 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select t.tagName from YouTubeLikedVideo lv join lv.video v join YouTubeVideoTag t on t.video.id = v.id where lv.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }

    public List<String> findSubscriptionTitles(Long accountId) {
        // TODO: 엔티티/필드명이 다를 경우 쿼리의 YouTubeSubscription, title 필드를 실제 구조에 맞게 수정
        return em.createQuery(
                "select s.title from YouTubeSubscription s where s.account.id = :accountId",
                String.class
        ).setParameter("accountId", accountId).getResultList();
    }
}
