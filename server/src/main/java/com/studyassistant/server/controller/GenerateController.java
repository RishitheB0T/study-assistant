package com.studyassistant.server.controller;

import com.studyassistant.server.dto.GenerateRequest;
import com.studyassistant.server.dto.GenerateResponse;
import com.studyassistant.server.service.StudySetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GenerateController {

    private final StudySetService studySets;

    public GenerateController(StudySetService studySets) {
        this.studySets = studySets;
    }

    /**
     * Notes in, the model's raw JSON text out. Bad input never reaches Gemini (@Valid).
     * ?chaos=<mode> (debug only) returns a fake bad reply instead of calling Gemini.
     */
    @PostMapping("/generate")
    public GenerateResponse generate(
            @Valid @RequestBody GenerateRequest request,
            @RequestParam(required = false) String chaos) {
        return GenerateResponse.of(studySets.generate(request.notes().trim(), chaos));
    }
}
