package com.example.dahaeng.global.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 루트 경로(/) 요청 시 404 에러 방지 및 인증 코드 확인을 위한 컨트롤러
 */
@RestController
public class RootController {

    @GetMapping(value = "/", produces = "text/html; charset=UTF-8")
    public String index(@RequestParam(value = "code", required = false) String code) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='text-align: center; margin-top: 50px; font-family: sans-serif;'>");
        sb.append("<h1>Dahaeng API Server is running! 🚀</h1>");
        
        if (code != null && !code.isBlank()) {
            sb.append("<div style='background-color: #f9f9f9; padding: 30px; border-radius: 15px; border: 2px solid #007bff; display: inline-block; margin-top: 20px;'>");
            sb.append("<h2 style='color: #007bff;'>[ Authentication Code ]</h2>");
            sb.append("<p style='font-size: 32px; color: #e91e63; font-weight: bold; letter-spacing: 2px;'>").append(code).append("</p>");
            sb.append("<p style='color: #666;'>위 코드를 복사하여 <b>/api/auth/exchange</b> API 요청에 사용하세요.</p>");
            sb.append("<button onclick='navigator.clipboard.writeText(\"").append(code).append("\").then(() => alert(\"Code copied!\"))' style='padding: 10px 20px; font-size: 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px;'>코드 복사하기</button>");
            sb.append("</div>");
        } else {
            sb.append("<p style='color: #888; margin-top: 20px;'>현재 로그인 코드가 전달되지 않았습니다.</p>");
        }
        sb.append("</div>");
        
        return sb.toString();
    }
}
