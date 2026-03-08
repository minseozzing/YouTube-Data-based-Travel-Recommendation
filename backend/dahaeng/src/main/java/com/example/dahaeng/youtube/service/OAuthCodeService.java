package com.example.dahaeng.youtube.service;

import com.example.dahaeng.auth.dto.CustomOAuth2User;
import com.example.dahaeng.global.exception.CustomException;
import com.example.dahaeng.global.exception.ErrorCode;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuthCodeService {

    private static final long TTL_SECONDS = 60; // 1Î∂?
    private final Map<String, Entry> store = new ConcurrentHashMap<>();

    public String issueCode(CustomOAuth2User user) {
        String code = UUID.randomUUID().toString();

        store.put(code, new Entry(
                user.getId(),
                user.getRole(),
                Instant.now().plusSeconds(TTL_SECONDS)
        ));

        return code;
    }

    /** 1?åÏö©: ?¨Ïö©?òÎ©¥ ??†ú. ?†Ìö®?òÏ? ?äÏúºÎ©?CustomException Î∞úÏÉù */
    public Entry consume(String code) {
        if (code == null || code.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_PARAMETER, "?∏Ï¶ù ÏΩîÎìú???ÑÏàò?ÖÎãà??");
        }

        Entry entry = store.remove(code);
        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            throw new CustomException(ErrorCode.OAUTH_CODE_INVALID);
        }
        return entry;
    }

    public record Entry(Long memberId, String role, Instant expiresAt) {}
}
