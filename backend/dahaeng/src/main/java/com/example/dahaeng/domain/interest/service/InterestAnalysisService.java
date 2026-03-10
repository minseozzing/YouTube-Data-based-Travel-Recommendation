package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterestAnalysisService {

    private final RawInterestSignalCollector collector;
    private final InterestTextCleaner cleaner;
    private final InterestPhraseNormalizer phraseNormalizer;
    private final InterestTokenizer tokenizer;
    private final InterestKeywordNormalizer normalizer;
    private final InterestScoreCalculator scoreCalculator;
    private final InterestCategoryMapper categoryMapper;
    private final TravelPreferenceTagService travelPreferenceTagService;
    private final InterestResultSaver saver;

    /**
     * 전체 관심사 분석 파이프라인 실행
     * 수집 -> 정제 -> 복합어 보호 -> 토큰화 -> 키워드 정규화 -> 점수 계산(최근성 포함) -> 카테고리 매핑 -> 여행 취향 추론 -> 저장
     */
    @Transactional
    public InterestAnalysisResult analyze(Long accountId) {
        // 1. 데이터 수집
        var raw = collector.collect(accountId);
        
        // 2. 텍스트 정제
        var cleaned = cleaner.clean(raw);
        
        // 3. 복합어 보호
        var phrased = phraseNormalizer.normalizePhrases(cleaned);
        
        // 4. 토큰화
        var tokens = tokenizer.tokenize(phrased);
        
        // 5. 키워드 정규화
        var normalized = normalizer.normalize(tokens);
        
        // 6. 점수 계산
        List<InterestKeywordCandidate> keywordScores = scoreCalculator.score(normalized);
        
        // 7. 카테고리 매핑 (기존 방식 유지)
        Map<InterestCategory, Double> categoryScores = categoryMapper.map(keywordScores);

        // 8. 여행 취향 태그 추론 (Spring AI + LLM)
        List<TravelTagScore> travelTags = travelPreferenceTagService.inferTravelTags(keywordScores);
        
        // 9. 결과 저장 ( travelTags 포함)
        saver.save(accountId, keywordScores, categoryScores, travelTags);
        
        return InterestAnalysisResult.builder()
                .accountId(accountId)
                .keywords(keywordScores)
                .categories(categoryScores)
                .travelTags(travelTags)
                .build();
    }
}
