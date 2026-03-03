package com.example.dahaeng.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;

    // 프론트에 내려줄 메시지(= 개발자가 정한 문장)
    private final String clientMessage;

    // 서버 로그에만 남길 상세 메시지(민감/디버그 정보 포함 가능)
    private final String logMessage;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
        this.clientMessage = errorCode.getDefaultMessage();
        this.logMessage = null;
    }

    public CustomException(ErrorCode errorCode, String clientMessage) {
        super(clientMessage);
        this.errorCode = errorCode;
        this.clientMessage = clientMessage;
        this.logMessage = null;
    }

    public CustomException(ErrorCode errorCode, String clientMessage, String logMessage) {
        super(clientMessage);
        this.errorCode = errorCode;
        this.clientMessage = clientMessage;
        this.logMessage = logMessage;
    }

    public CustomException(ErrorCode errorCode, String clientMessage, String logMessage, Throwable cause) {
        super(clientMessage, cause);
        this.errorCode = errorCode;
        this.clientMessage = clientMessage;
        this.logMessage = logMessage;
    }
}