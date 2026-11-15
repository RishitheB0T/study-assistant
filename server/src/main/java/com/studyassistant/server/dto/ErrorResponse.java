package com.studyassistant.server.dto;

import com.studyassistant.server.exception.ErrorCode;

/** Failure reply: { "ok": false, "error": { "code": "TIMEOUT", "message": "..." } }. */
public record ErrorResponse(boolean ok, Details error) {

    public record Details(String code, String message) {
    }

    public static ErrorResponse of(ErrorCode code, String message) {
        return new ErrorResponse(false, new Details(code.name(), message));
    }
}
