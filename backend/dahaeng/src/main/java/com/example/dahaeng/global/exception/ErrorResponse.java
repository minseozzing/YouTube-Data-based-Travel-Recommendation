package com.example.dahaeng.global.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String code,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public static ErrorResponse of(int status, String code, String message, String path) {
        return new ErrorResponse(
                status,
                code,
                message,
                path,
                LocalDateTime.now()
        );
    }
}