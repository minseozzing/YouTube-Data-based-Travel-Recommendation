package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.ExtractedInterestFeatures;
import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import com.example.dahaeng.domain.interest.enums.InterestCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Interest Analysis Orchestrator
 * 트랜잭션 경계를 관리하고 각 엔진/클라이언트를 조율합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InterestAnalysisService {

    private final KeywordExtractionEngine extractionEngine;
    private final TravelTagInferenceClient aiClient;
    private final TravelTagValidator validator;
    // [DELETE_START] (아래 1줄 삭제)
    private final InterestCategoryMapper categoryMapper;
    // [DELETE_END]
    private final InterestResultSaver saver;

    public InterestAnalysisResult analyze(Long accountId) {
        log.info(">>> [COORDINATOR] Starting orchestrated analysis for account: {}", accountId);

        // Phase 1: Feature Engineering (Short Read-only Transaction)
        ExtractedInterestFeatures features = extractionEngine.extractFeatures(accountId);

        // Phase 2: AI Inference (No Transaction - DB Connection Released)
        List<TravelTagScore> rawTags = aiClient.inferTags(features.getTop30ForAi());

        // Phase 3: Evidence-based Validation (No Transaction)
        List<TravelTagScore> validatedTags = validator.validate(rawTags, features.getTop30ForAi());
        log.info(">>> [VALIDATION] {}/{} tags passed evidence check.", validatedTags.size(), rawTags.size());

        // Phase 4: Persistence (Short Write Transaction)
        saveFinalResults(features, validatedTags);

        return InterestAnalysisResult.builder()
                .accountId(accountId)
                .keywords(features.getAllKeywords())
                // [DELETE_START] (아래 1줄 삭제)
                .categories(categoryMapper.map(features.getAllKeywords()))
                // [DELETE_END]
                .travelTags(validatedTags)
                .build();
    }

    private void saveFinalResults(ExtractedInterestFeatures features, List<TravelTagScore> validatedTags) {
        // [DELETE_START] (아래 2줄 삭제)
        Map<InterestCategory, Double> categoryScores = categoryMapper.map(features.getAllKeywords());
        saver.save(features.getAccountId(), features.getAllKeywords(), categoryScores, validatedTags);
        // [DELETE_END]
        // [REPLACE_WITH] (위 삭제 후 아래 코드로 대체)
        // saver.save(features.getAccountId(), features.getAllKeywords(), null, validatedTags);
        
        log.info(">>> [Phase 3] All results successfully persisted to DB.");
    }
}
