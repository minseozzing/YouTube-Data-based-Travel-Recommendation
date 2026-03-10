package com.example.dahaeng.domain.interest.service;

import com.example.dahaeng.domain.interest.dto.InterestKeywordCandidate;
import com.example.dahaeng.domain.interest.dto.TravelTagInferenceResponse;
import com.example.dahaeng.domain.interest.dto.TravelTagScore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class TravelTagInferenceClient {

    private final ChatClient chatClient;
    private final TravelTagPromptFactory promptFactory;

    public TravelTagInferenceClient(ChatClient.Builder chatClientBuilder, TravelTagPromptFactory promptFactory) {
        this.chatClient = chatClientBuilder
                .defaultSystem(promptFactory.createSystemPrompt())
                .build();
        this.promptFactory = promptFactory;
    }

    public List<TravelTagScore> inferTags(List<InterestKeywordCandidate> topKeywords) {
        log.info(">>> [Phase 2] Requesting AI inference for {} keywords.", topKeywords.size());
        
        try {
            TravelTagInferenceResponse response = chatClient.prompt()
                    .user(u -> u.text("사용자 분석 데이터:\n{data}")
                               .param("data", promptFactory.createUserPrompt(topKeywords)))
                    .call()
                    .entity(TravelTagInferenceResponse.class);

            if (response == null || response.getTags() == null) {
                log.warn(">>> [AI EMPTY] AI returned no tags.");
                return Collections.emptyList();
            }
            
            log.info(">>> [AI RESPONSE] Received {} raw tags from AI.", response.getTags().size());
            return response.getTags();
            
        } catch (Exception e) {
            log.error(">>> [AI ERROR] LLM inference failed: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
