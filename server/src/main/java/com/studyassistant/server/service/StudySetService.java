package com.studyassistant.server.service;

import com.studyassistant.server.client.GeminiClient;
import org.springframework.stereotype.Service;

/** Decides where a study set comes from: Gemini normally, or a fake bad reply in debug mode. */
@Service
public class StudySetService {

    private final GeminiClient gemini;
    private final ChaosReplies chaosReplies;

    public StudySetService(GeminiClient gemini, ChaosReplies chaosReplies) {
        this.gemini = gemini;
        this.chaosReplies = chaosReplies;
    }

    /** chaos is null in normal use; a debug mode name skips Gemini and returns a fake reply. */
    public String generate(String notes, String chaos) {
        if (chaos == null || chaos.isBlank()) {
            return gemini.generateStudySet(notes);
        }
        return chaosReplies.reply(chaos);
    }
}
