package com.example.dahaeng.global.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 비즈니스 예외
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustom(CustomException e, HttpServletRequest request) {
        ErrorCode code = e.getErrorCode();
        String path = request.getRequestURI();

        boolean isServerSide = code == ErrorCode.INTERNAL_ERROR;

        if (isServerSide) {
            if (e.getLogMessage() != null) {
                log.error("[BUSINESS] code={} path={} logMessage={}",
                        code.name(), path, e.getLogMessage(), e);
            } else {
                log.error("[BUSINESS] code={} path={}", code.name(), path, e);
            }
        } else {
            if (e.getLogMessage() != null) {
                log.warn("[BUSINESS] code={} path={} logMessage={}",
                        code.name(), path, e.getLogMessage());
            } else {
                log.warn("[BUSINESS] code={} path={} message={}",
                        code.name(), path, e.getClientMessage());
            }
        }

        return ResponseEntity.status(code.getStatus())
                .body(ErrorResponse.of(
                        code.getStatus().value(),
                        code.name(),
                        e.getClientMessage(),
                        path
                ));
    }

    // @Valid 검증 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException e,
            HttpServletRequest request) {

        ErrorCode code = ErrorCode.VALIDATION_FAILED;
        String path = request.getRequestURI();

        String message = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("[VALIDATION] code={} path={} message={}",
                code.name(), path, message);

        return ResponseEntity.status(code.getStatus())
                .body(ErrorResponse.of(
                        code.getStatus().value(),
                        code.name(),
                        message,
                        path
                ));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
        Exception e,
        HttpServletRequest request
    ) {
        ErrorCode code = ErrorCode.NOT_FOUND;
        String path = request.getRequestURI();

        log.error("[UNHANDLED] code={} path={}", code.name(), path, e);

        return ResponseEntity.status(code.getStatus())
            .body(ErrorResponse.of(
                code.getStatus().value(),
                code.name(),
                "잘못된 요청 경로입니다.",
                path
            ));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
        Exception e,
        HttpServletRequest request
    ) {

        ErrorCode code = ErrorCode.METHOD_NOT_ALLOWED;
        String path = request.getRequestURI();

        log.error("[UNHANDLED] code={} path={}", code.name(), path, e);

        return ResponseEntity.status(code.getStatus())
            .body(ErrorResponse.of(
                code.getStatus().value(),
                code.name(),
                code.getDefaultMessage(),
                path
            ));
    }

    // 그 외 모든 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception e,
            HttpServletRequest request) {

        ErrorCode code = ErrorCode.INTERNAL_ERROR;
        String path = request.getRequestURI();

        log.error("[UNHANDLED] code={} path={}", code.name(), path, e);

        return ResponseEntity.status(code.getStatus())
                .body(ErrorResponse.of(
                        code.getStatus().value(),
                        code.name(),
                        code.getDefaultMessage(),
                        path
                ));
    }
}
