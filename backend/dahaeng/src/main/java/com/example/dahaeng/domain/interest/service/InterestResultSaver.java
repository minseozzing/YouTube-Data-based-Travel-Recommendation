package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import com.example.dahaeng.domain.interest.repository.YoutubeInterestKeywordRepository;
import com.example.dahaeng.domain.youtube.entity.YouTubeAccount;
import com.example.dahaeng.domain.youtube.entity.YouTubeInterestKeyword;
import com.example.dahaeng.domain.youtube.entity.YouTubeTravelTag;
import com.example.dahaeng.domain.youtube.enums.SourceType;
import com.example.dahaeng.domain.youtube.repository.YouTubeAccountRepository;
import com.example.dahaeng.domain.youtube.repository.YouTubeTravelTagRepository;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestResultSaver {

    private final YouTubeAccountRepository accountRepository;
    private final YoutubeInterestKeywordRepository keywordRepository;
    private final YouTubeTravelTagRepository travelTagRepository;

    @Transactional
    public void save(Long accountId,
                     List<InterestKeywordCandidate> keywords,
                     List<TravelTagScore> travelTags) {
        saveKeywords(accountId, keywords);
        saveTravelTags(accountId, travelTags);
    }

    @Transactional
    public void saveKeywords(Long accountId, List<InterestKeywordCandidate> keywords) {
        YouTubeAccount account = getAccount(accountId);
        keywordRepository.deleteByAccount_Id(accountId);

        LocalDateTime now = LocalDateTime.now();

        if (keywords != null) {
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
        }
    }

    @Transactional
    public void saveTravelTags(Long accountId, List<TravelTagScore> travelTags) {
        YouTubeAccount account = getAccount(accountId);
        travelTagRepository.deleteByAccount_Id(accountId);

        LocalDateTime now = LocalDateTime.now();

        if (travelTags != null && !travelTags.isEmpty()) {
            List<YouTubeTravelTag> tagEntities = travelTags.stream()
                    .map(t -> YouTubeTravelTag.builder()
                            .account(account)
                            .tagName(t.getTag())
                            .categoryName(t.getCategory())
                            .score(t.getScore())
                            .confidence(t.getConfidence())
                            .reason(t.getReason())
                            .analyzedAt(now)
                            .build())
                    .toList();
            travelTagRepository.saveAllAndFlush(tagEntities);
            System.out.println(">>> [DB SAVE SUCCESS] Saved " + tagEntities.size() + " travel tags for account " + accountId);
        } else {
            System.out.println(">>> [DB SAVE SKIP] No travel tags to save for account " + accountId);
        }
    }

    private YouTubeAccount getAccount(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "Linked account not found."));
    }

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
