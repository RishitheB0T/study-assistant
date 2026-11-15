package com.studyassistant.server.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/** The parts of a Gemini generateContent reply that we read. Everything else is ignored. */
@JsonIgnoreProperties(ignoreUnknown = true)
record GeminiResponse(List<Candidate> candidates, PromptFeedback promptFeedback) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Candidate(Content content, String finishReason) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Content(List<Part> parts) {
    }

    /** thought = true marks the model's internal reasoning, which we never pass on. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Part(String text, Boolean thought) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record PromptFeedback(String blockReason) {
    }
}
