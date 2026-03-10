package com.example.dahaeng.domain.interest.controller;

import com.example.dahaeng.domain.interest.dto.InterestAnalysisResult;
import com.example.dahaeng.domain.interest.service.InterestAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/interest")
public class InterestController {

    private final InterestAnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody AnalyzeRequest request) {
        if (request == null || request.accountId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "accountId is required"));
        }
        InterestAnalysisResult result = analysisService.analyze(request.accountId());
        return ResponseEntity.ok(result);
    }

    public record AnalyzeRequest(Long accountId) {}
}