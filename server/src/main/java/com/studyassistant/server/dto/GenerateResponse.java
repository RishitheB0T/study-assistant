package com.studyassistant.server.dto;

/** Success reply: { "ok": true, "text": "...the model's raw answer..." }. The browser checks the text. */
public record GenerateResponse(boolean ok, String text) {

    public static GenerateResponse of(String text) {
        return new GenerateResponse(true, text);
    }
}
