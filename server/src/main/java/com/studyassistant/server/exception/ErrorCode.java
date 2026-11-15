package com.studyassistant.server.exception;

import org.springframework.http.HttpStatus;

/** Every failure the frontend can receive, with the HTTP status it is sent with. */
public enum ErrorCode {
    BAD_INPUT(HttpStatus.BAD_REQUEST),
    NO_KEY(HttpStatus.INTERNAL_SERVER_ERROR),
    TIMEOUT(HttpStatus.GATEWAY_TIMEOUT),
    RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS),
    PROVIDER_ERROR(HttpStatus.BAD_GATEWAY);

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
