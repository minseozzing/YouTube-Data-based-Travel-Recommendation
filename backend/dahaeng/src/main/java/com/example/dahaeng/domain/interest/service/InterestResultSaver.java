package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.enums.InterestCategory;
import com.example.dahaeng.domain.interest.repository.YoutubeInterestKeywordRepository;
import com.example.dahaeng.domain.interest.repository.YoutubeInterestRepository;
import com.example.dahaeng.youtube.entity.YouTubeAccount;
import com.example.dahaeng.youtube.entity.YouTubeInterest;
import com.example.dahaeng.youtube.entity.YouTubeInterestKeyword;
import com.example.dahaeng.youtube.repository.YouTubeAccountRepository;
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

        // TODO: accountId가 memberId로 넘어오는 경우, accountRepository.findByMemberId로 변경 필요
        YouTubeAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "연동 계정을 찾을 수 없습니다."));

        keywordRepository.deleteByAccount_Id(accountId);
        interestRepository.deleteByAccount_Id(accountId);

        LocalDateTime now = LocalDateTime.now();

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

    private com.example.dahaeng.youtube.enums.SourceType mapSourceType(com.example.dahaeng.domain.interest.enums.InterestSourceType type) {
        if (type == null) {
            return com.example.dahaeng.youtube.enums.SourceType.PLAYLIST_TITLE;
        }
        switch (type) {
            case PLAYLIST_TITLE:
                return com.example.dahaeng.youtube.enums.SourceType.PLAYLIST_TITLE;
            case PLAYLIST_VIDEO_TITLE:
                return com.example.dahaeng.youtube.enums.SourceType.PLAYLIST_VIDEO_TITLE;
            case PLAYLIST_VIDEO_TAG:
                return com.example.dahaeng.youtube.enums.SourceType.PLAYLIST_VIDEO_TAG;
            case LIKED_VIDEO_TITLE:
                return com.example.dahaeng.youtube.enums.SourceType.LIKED_VIDEO_TITLE;
            case LIKED_VIDEO_TAG:
                return com.example.dahaeng.youtube.enums.SourceType.LIKED_VIDEO_TAG;
            case SUBSCRIPTION_TITLE:
            default:
                return com.example.dahaeng.youtube.enums.SourceType.SUBSCRIPTION_TITLE;
        }
    }
}
