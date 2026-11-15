package com.studyassistant.server.exception;

/** A failure we expected and can describe to the user. ApiExceptionHandler turns it into JSON. */
public class ApiException extends RuntimeException {

    private final ErrorCode code;
    private final String retryAfter;

    public ApiException(ErrorCode code, String message) {
        this(code, message, null);
    }

    public ApiException(ErrorCode code, String message, String retryAfter) {
        super(message);
        this.code = code;
        this.retryAfter = retryAfter;
    }

    public ErrorCode code() {
        return code;
    }

    /** Seconds to wait before retrying, when the provider told us; otherwise null. */
    public String retryAfter() {
        return retryAfter;
    }
}
