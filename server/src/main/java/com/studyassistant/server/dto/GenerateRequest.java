package com.studyassistant.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Body of POST /api/generate: { "notes": "..." }. Same 4,000-character limit as the text box. */
public record GenerateRequest(
        @NotBlank(message = "Please enter some notes or a topic.")
        @Size(max = 4000, message = "Notes must be 4,000 characters or fewer.")
        String notes) {
}
