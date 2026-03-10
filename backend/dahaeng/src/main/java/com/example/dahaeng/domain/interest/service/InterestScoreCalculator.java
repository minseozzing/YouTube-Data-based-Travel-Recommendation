package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.enums.InterestSourceType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InterestScoreCalculator {

    private final Map<InterestSourceType, Double> sourceWeightMap;
    private final Set<String> genericKeywords;
    
    private static final double MIN_SCORE_THRESHOLD = 1.0;

    public InterestScoreCalculator(Map<InterestSourceType, Double> sourceWeightMap,
                                   @Qualifier("genericKeywords") Set<String> genericKeywords) {
        this.sourceWeightMap = sourceWeightMap;
        this.genericKeywords = genericKeywords;
    }

    public List<InterestKeywordCandidate> score(List<InterestKeywordCandidate> normalizedCandidates) {
        if (normalizedCandidates == null || normalizedCandidates.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, KeywordScoreModel> scoreModels = new HashMap<>();

        for (InterestKeywordCandidate candidate : normalizedCandidates) {
            String normKey = candidate.getNormalizedKeyword();
            String rawKey = candidate.getRawKeyword();
            
            KeywordScoreModel model = scoreModels.computeIfAbsent(normKey, k -> new KeywordScoreModel(normKey, rawKey));
            model.addOccurrence(candidate.getSourceType(), candidate.getLatestSignalTime());
        }

        return scoreModels.values().stream()
                .map(this::calculateFinalCandidate)
                .filter(c -> c.getTotalScore() >= MIN_SCORE_THRESHOLD)
                .sorted(Comparator.comparingDouble(InterestKeywordCandidate::getTotalScore).reversed())
                .collect(Collectors.toList());
    }

    private InterestKeywordCandidate calculateFinalCandidate(KeywordScoreModel model) {
        double dampedScoreSum = 0.0;
        InterestSourceType representativeSource = null;
        double maxContribution = -1.0;

        for (Map.Entry<InterestSourceType, Integer> entry : model.sourceCounts.entrySet()) {
            InterestSourceType source = entry.getKey();
            int count = entry.getValue();
            double weight = sourceWeightMap.getOrDefault(source, 1.0);
            
            double contribution = weight * Math.sqrt(count);
            dampedScoreSum += contribution;

            if (contribution > maxContribution) {
                maxContribution = contribution;
                representativeSource = source;
            }
        }

        int distinctSources = model.getDistinctSourceCount();
        double diversityBonus = (distinctSources >= 2) ? (distinctSources - 1) * 0.2 : 0.0;
        double recencyWeight = getRecencyWeight(model.latestSignalTime);

        double finalScore = dampedScoreSum * (1 + diversityBonus) * recencyWeight;

        if (genericKeywords.contains(model.normalizedKeyword.toLowerCase(Locale.ROOT))) {
            finalScore *= 0.5;
        }

        return InterestKeywordCandidate.builder()
                .rawKeyword(model.representativeRawKeyword)
                .normalizedKeyword(model.normalizedKeyword)
                .totalScore(finalScore)
                .sourceTypes(model.sourceCounts.keySet())
                .totalCount(model.getTotalCount())
                .distinctSourceCount(distinctSources)
                .latestSignalTime(model.latestSignalTime)
                .sourceType(representativeSource)
                .build();
    }

    private double getRecencyWeight(LocalDateTime signalTime) {
        if (signalTime == null) return 1.0;
        long days = ChronoUnit.DAYS.between(signalTime, LocalDateTime.now());
        if (days <= 7) return 1.3;
        if (days <= 30) return 1.15;
        if (days <= 90) return 1.0;
        if (days <= 180) return 0.8;
        return 0.6;
    }

    private static class KeywordScoreModel {
        private final String normalizedKeyword;
        private final String representativeRawKeyword;
        private final Map<InterestSourceType, Integer> sourceCounts = new HashMap<>();
        private LocalDateTime latestSignalTime;
        
        public KeywordScoreModel(String normalizedKeyword, String rawKeyword) {
            this.normalizedKeyword = normalizedKeyword;
            this.representativeRawKeyword = rawKeyword;
        }

        public void addOccurrence(InterestSourceType source, LocalDateTime signalTime) {
            sourceCounts.put(source, sourceCounts.getOrDefault(source, 0) + 1);
            if (signalTime != null) {
                if (latestSignalTime == null || signalTime.isAfter(latestSignalTime)) {
                    latestSignalTime = signalTime;
                }
            }
        }

        public int getDistinctSourceCount() { return sourceCounts.size(); }
        public int getTotalCount() { return sourceCounts.values().stream().mapToInt(Integer::intValue).sum(); }
    }
}
