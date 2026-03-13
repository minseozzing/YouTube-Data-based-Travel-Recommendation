package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.ExtractedInterestFeatures;
import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.dto.InterestTagResponse;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import com.example.dahaeng.domain.youtube.repository.YouTubeTravelTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Interest Analysis Orchestrator
 * 트랜잭션 경계를 관리하고 각 엔진/클라이언트를 조합합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InterestAnalysisService {

    private final KeywordExtractionEngine extractionEngine;
    private final TravelTagInferenceClient aiClient;
    private final TravelTagValidator validator;
    private final InterestResultSaver saver;
    private final YouTubeTravelTagRepository youTubeTravelTagRepository;

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
                .travelTags(validatedTags)
                .build();
    }

    private void saveFinalResults(ExtractedInterestFeatures features, List<TravelTagScore> validatedTags) {
        saver.save(features.getAccountId(), features.getAllKeywords(), validatedTags);

        log.info(">>> [Phase 3] All results successfully persisted to DB.");
    }

    public List<InterestTagResponse> getAnalyzedTags(Long accountId) {
        return youTubeTravelTagRepository.findByAccount_Id(accountId).stream()
                .map(tag -> InterestTagResponse.builder()
                        .categoryName(tag.getCategoryName())
                        .tagName(tag.getTagName())
                        .build())
                .toList();
    }
}
