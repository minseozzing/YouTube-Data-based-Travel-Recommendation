package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.dto.TravelTagInferenceResponse;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class TravelPreferenceTagService {

    private final ChatClient chatClient;
    private final LlmKeywordFilter keywordFilter;
    private final TravelTagPromptFactory promptFactory;
    private final TravelTagPostProcessor postProcessor;

    public TravelPreferenceTagService(ChatClient.Builder chatClientBuilder,
                                     LlmKeywordFilter keywordFilter,
                                     TravelTagPromptFactory promptFactory,
                                     TravelTagPostProcessor postProcessor) {
        // 시스템 프롬프트 설정 시에도 중괄호 이슈를 피하기 위해 defaultSystem(String) 대신 명확한 처리 고려
        this.chatClient = chatClientBuilder
                .defaultSystem(promptFactory.createSystemPrompt())
                .build();
        this.keywordFilter = keywordFilter;
        this.promptFactory = promptFactory;
        this.postProcessor = postProcessor;
    }

    public List<TravelTagScore> inferTravelTags(List<InterestKeywordCandidate> rawKeywords) {
        if (rawKeywords == null || rawKeywords.isEmpty()) {
            return Collections.emptyList();
        }

        List<InterestKeywordCandidate> filtered = keywordFilter.filter(rawKeywords);
        log.info("Travel Tag Inference - Filtered keywords size: {}", filtered.size());

        if (filtered.isEmpty()) {
            return Collections.emptyList();
        }

        String inputData = promptFactory.createUserPrompt(filtered);
        log.info(">>> [AI INPUT DATA] : {}", inputData);

        try {
            TravelTagInferenceResponse response = chatClient.prompt()
                    .user(u -> u.text("사용자 관심 키워드 데이터:\n{data}")
                               .param("data", inputData))
                    .call()
                    .entity(TravelTagInferenceResponse.class);

            if (response == null || response.getTags() == null || response.getTags().isEmpty()) {
                log.warn(">>> [AI EMPTY] AI returned no tags.");
                return Collections.emptyList();
            }

            log.info(">>> [AI RAW RESULT] AI returned {} tags before processing.", response.getTags().size());
            
            List<TravelTagScore> result = postProcessor.process(response.getTags());
            log.info(">>> [FINAL TAGS] {} tags remained after strict validation.", result.size());
            
            return result;
        } catch (Exception e) {
            log.error("Travel Tag Inference - Failed: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
