package com.studyassistant.server;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GenerateController {

    private final GeminiClient gemini;

    public GenerateController(GeminiClient gemini) {
        this.gemini = gemini;
    }

    /** Notes in, the model's raw JSON text out. Bad input never reaches Gemini (@Valid). */
    @PostMapping("/generate")
    public GenerateResponse generate(@Valid @RequestBody GenerateRequest request) {
        return GenerateResponse.of(gemini.generateStudySet(request.notes().trim()));
    }
}
