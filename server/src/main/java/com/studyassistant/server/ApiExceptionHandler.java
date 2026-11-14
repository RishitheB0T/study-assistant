package com.studyassistant.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Turns every failure into the same JSON shape, so the frontend handles one format only. */
@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApi(ApiException ex) {
        var reply = ResponseEntity.status(ex.code().status());
        if (ex.retryAfter() != null) {
            reply.header(HttpHeaders.RETRY_AFTER, ex.retryAfter());
        }
        return reply.body(ErrorResponse.of(ex.code(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleInvalid(MethodArgumentNotValidException ex) {
        var firstError = ex.getBindingResult().getFieldErrors().getFirst();
        return badInput(firstError.getDefaultMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadable(HttpMessageNotReadableException ex) {
        return badInput("The request body must be JSON like {\"notes\": \"...\"}.");
    }

    /**
     * Any bug in our code: log it on the server, show the user a calm message. RuntimeException,
     * not Exception, so Spring's own 404 / 405 / 415 replies (checked exceptions) still work.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(RuntimeException ex) {
        log.error("Unexpected error while generating a study set", ex);
        return ResponseEntity.status(ErrorCode.PROVIDER_ERROR.status())
                .body(ErrorResponse.of(ErrorCode.PROVIDER_ERROR, "Something went wrong on the server. Please try again."));
    }

    private ResponseEntity<ErrorResponse> badInput(String message) {
        return ResponseEntity.status(ErrorCode.BAD_INPUT.status())
                .body(ErrorResponse.of(ErrorCode.BAD_INPUT, message));
    }
}
