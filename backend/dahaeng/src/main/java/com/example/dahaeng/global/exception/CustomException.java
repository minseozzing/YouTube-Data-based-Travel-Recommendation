package com.example.dahaeng.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;

    // ?„ë¡ ?¸ì— ?´ë ¤ì¤?ë©”ì‹œì§€(= ê°œë°œ?ê? ?•í•œ ë¬¸ì¥)
    private final String clientMessage;

    // ?œë²„ ë¡œê·¸?ë§Œ ?¨ê¸¸ ?ì„¸ ë©”ì‹œì§€(ë¯¼ê°/?”ë²„ê·??•ë³´ ?¬í•¨ ê°€??
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
