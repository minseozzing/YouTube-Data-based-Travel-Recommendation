package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.enums.InterestCategory;
import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import com.example.dahaeng.domain.interest.repository.YoutubeInterestKeywordRepository;
import com.example.dahaeng.domain.interest.repository.YoutubeInterestRepository;
import com.example.dahaeng.domain.youtube.entity.YouTubeAccount;
import com.example.dahaeng.domain.youtube.entity.YouTubeInterest;
import com.example.dahaeng.domain.youtube.entity.YouTubeInterestKeyword;
import com.example.dahaeng.domain.youtube.enums.SourceType;
import com.example.dahaeng.domain.youtube.repository.YouTubeAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterestResultSaver {

    private final YouTubeAccountRepository accountRepository;
    private final YoutubeInterestRepository interestRepository;
    private final YoutubeInterestKeywordRepository keywordRepository;

    @Transactional
    public void save(Long accountId,
                     List<InterestKeywordCandidate> keywords,
                     Map<InterestCategory, Double> categories) {

        // 1. 연동 계정 조회
        YouTubeAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "연동 계정을 찾을 수 없습니다."));

        // 2. 기존 분석 결과 초기화 (삭제 후 재삽입)
        keywordRepository.deleteByAccount_Id(accountId);
        interestRepository.deleteByAccount_Id(accountId);

        LocalDateTime now = LocalDateTime.now();

        // 3. 관심 키워드(Keyword) 저장
        List<YouTubeInterestKeyword> keywordEntities = keywords.stream()
                .map(k -> YouTubeInterestKeyword.builder()
                        .account(account)
                        .keyword(k.getRawKeyword())
                        .normalizedKeyword(k.getNormalizedKeyword())
                        .sourceType(mapSourceType(k.getSourceType()))
                        .score(k.getScore())
                        .analyzedAt(now)
                        .build())
                .toList();
        keywordRepository.saveAll(keywordEntities);

        // 4. 관심 카테고리(Category) 점수 기반 정렬 및 저장
        List<Map.Entry<InterestCategory, Double>> sorted = categories.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .toList();

        int rank = 1;
        for (Map.Entry<InterestCategory, Double> e : sorted) {
            YouTubeInterest interest = YouTubeInterest.builder()
                    .account(account)
                    .categoryName(e.getKey().name())
                    .score(e.getValue())
                    .rankNo(rank++)
                    .analysisVersion("rule-v1")
                    .analyzedAt(now)
                    .build();
            interestRepository.save(interest);
        }
    }

    /**
     * 관심분야 모듈의 SourceType을 유튜브 모듈의 SourceType으로 매핑
     */
    private SourceType mapSourceType(InterestSourceType type) {
        if (type == null) {
            return SourceType.PLAYLIST_TITLE;
        }

        return switch (type) {
            case PLAYLIST_TITLE -> SourceType.PLAYLIST_TITLE;
            case PLAYLIST_VIDEO_TITLE -> SourceType.PLAYLIST_VIDEO_TITLE;
            case PLAYLIST_VIDEO_TAG -> SourceType.PLAYLIST_VIDEO_TAG;
            case LIKED_VIDEO_TITLE -> SourceType.LIKED_VIDEO_TITLE;
            case LIKED_VIDEO_TAG -> SourceType.LIKED_VIDEO_TAG;
            case SUBSCRIPTION_TITLE -> SourceType.SUBSCRIPTION_TITLE;
            default -> SourceType.SUBSCRIPTION_TITLE;
        };
    }
}