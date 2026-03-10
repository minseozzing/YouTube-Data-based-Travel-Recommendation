package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
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
    private final InterestResultSaver saver;

    /**
     * 전체 관심사 분석 파이프라인 실행
     * 수집 -> 정제 -> 복합어 보호 -> 토큰화 -> 키워드 정규화 -> 점수 계산(최근성 포함) -> 카테고리 매핑 -> 저장
     */
    @Transactional
    public InterestAnalysisResult analyze(Long accountId) {
        // 1. 데이터 수집 (시점 정보 포함)
        var raw = collector.collect(accountId);
        
        // 2. 텍스트 정제 (URL, 이모지 등 제거)
        var cleaned = cleaner.clean(raw);
        
        // 3. 복합어 보호 (백엔드_개발 등)
        var phrased = phraseNormalizer.normalizePhrases(cleaned);
        
        // 4. 토큰화 및 조사 트리밍
        var tokens = tokenizer.tokenize(phrased);
        
        // 5. 키워드 정규화 (유의어 통합)
        var normalized = normalizer.normalize(tokens);
        
        // 6. 점수 계산 (Frequency Damping, Diversity Bonus, Recency Weight, Generic Penalty)
        List<InterestKeywordCandidate> keywordScores = scoreCalculator.score(normalized);
        
        // 7. 카테고리 매핑
        Map<InterestCategory, Double> categoryScores = categoryMapper.map(keywordScores);
        
        // 8. 결과 저장
        saver.save(accountId, keywordScores, categoryScores);
        
        return InterestAnalysisResult.builder()
                .accountId(accountId)
                .keywords(keywordScores)
                .categories(categoryScores)
                .build();
    }
}
