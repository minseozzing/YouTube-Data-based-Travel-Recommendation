package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.InterestAnalysisResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public InterestAnalysisResult analyze(Long accountId) {
        var raw = collector.collect(accountId);
        var cleaned = cleaner.clean(raw);
        var phrased = phraseNormalizer.normalizePhrases(cleaned);
        var tokens = tokenizer.tokenize(phrased);
        var normalized = normalizer.normalize(tokens);
        var keywordScores = scoreCalculator.score(normalized);
        var categoryScores = categoryMapper.map(keywordScores);
        saver.save(accountId, keywordScores, categoryScores);
        return InterestAnalysisResult.builder()
                .accountId(accountId)
                .keywords(keywordScores)
                .categories(categoryScores)
                .build();
    }
}
