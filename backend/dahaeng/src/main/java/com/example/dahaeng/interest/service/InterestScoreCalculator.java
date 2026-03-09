package com.example.dahaeng.interest.service;

import com.example.dahaeng.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.interest.enums.InterestSourceType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestScoreCalculator {

    private final Map<InterestSourceType, Double> sourceWeightMap;
    private final Set<String> genericKeywords; // DictionaryConfig에서 주입받음
    
    private static final double MIN_SCORE_THRESHOLD = 1.0;

    public List<InterestKeywordCandidate> score(List<InterestKeywordCandidate> normalizedCandidates) {
        if (normalizedCandidates == null || normalizedCandidates.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, KeywordScoreModel> scoreModels = new HashMap<>();

        for (InterestKeywordCandidate candidate : normalizedCandidates) {
            String normKey = candidate.getNormalizedKeyword();
            String rawKey = candidate.getRawKeyword();
            InterestSourceType source = candidate.getSourceType();
            
            KeywordScoreModel model = scoreModels.computeIfAbsent(normKey, k -> new KeywordScoreModel(normKey, rawKey));
            model.addOccurrence(source);
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
        
        double finalScore = dampedScoreSum * (1 + diversityBonus);

        // 정규화된 키워드 기준으로 범용 단어 감점 (50%)
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
                .sourceType(representativeSource)
                .build();
    }

    private static class KeywordScoreModel {
        private final String normalizedKeyword;
        private final String representativeRawKeyword;
        private final Map<InterestSourceType, Integer> sourceCounts = new HashMap<>();
        
        public KeywordScoreModel(String normalizedKeyword, String rawKeyword) {
            this.normalizedKeyword = normalizedKeyword;
            this.representativeRawKeyword = rawKeyword;
        }

        public void addOccurrence(InterestSourceType source) {
            sourceCounts.put(source, sourceCounts.getOrDefault(source, 0) + 1);
        }

        public int getDistinctSourceCount() {
            return sourceCounts.size();
        }

        public int getTotalCount() {
            return sourceCounts.values().stream().mapToInt(Integer::intValue).sum();
        }
    }
}
