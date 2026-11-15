package com.studyassistant.server.service;

import com.studyassistant.server.exception.ApiException;
import com.studyassistant.server.exception.ErrorCode;
import org.springframework.stereotype.Component;

/**
 * Fake replies for the ?chaos= debug option, so every kind of bad AI output can be
 * shown on demand. Never calls Gemini, so it costs nothing and exposes nothing.
 */
@Component
public class ChaosReplies {

    private static final String GOOD_SET = """
            {"title": "Debug set", "items": [
              {"type": "flashcard", "id": "1", "front": "What does ?chaos= do?",
               "back": "It returns a fake reply instead of calling Gemini."},
              {"type": "mcq", "id": "2", "question": "Which part checks the AI's answer?",
               "options": ["The server", "The checkpoint", "Gemini", "Vite"], "answerIndex": 1,
               "explanation": "parseStudySet checks everything before it reaches the screen."}
            ]}""";

    private static final String PARTIAL_SET = """
            {"title": "Debug set with broken items", "items": [
              {"type": "flashcard", "id": "1", "front": "A good card", "back": "It passes the checkpoint."},
              {"type": "flashcard", "id": "2", "front": "", "back": "Empty front, so it is skipped."},
              {"type": "mcq", "id": "3", "question": "Only two options?", "options": ["A", "B"],
               "answerIndex": 0, "explanation": "Skipped: a question needs exactly 4 options."},
              {"type": "mcq", "id": "4", "question": "Is this question complete?",
               "options": ["Yes", "No", "Maybe", "Never"], "answerIndex": 0,
               "explanation": "It passes the checkpoint."}
            ]}""";

    public String reply(String mode) {
        return switch (mode) {
            case "malformed" -> "{\"title\": \"Debug set\", \"items\": [{\"type\": \"flash";
            case "wrong_shape" -> "{\"cards\": []}";
            case "empty" -> "";
            case "partial" -> PARTIAL_SET;
            case "slow" -> afterEightSeconds(GOOD_SET);
            case "fail" -> throw new ApiException(ErrorCode.PROVIDER_ERROR, "Debug: a simulated AI service failure.");
            default -> throw new ApiException(ErrorCode.BAD_INPUT,
                    "Unknown chaos mode. Use one of: malformed, wrong_shape, empty, partial, slow, fail.");
        };
    }

    private String afterEightSeconds(String text) {
        try {
            Thread.sleep(8000);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
        return text;
    }
}
