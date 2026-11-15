package com.studyassistant.server.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * The gemini.* settings from application.properties, in one typed object.
 * gemini.api-key maps to apiKey, gemini.base-url to baseUrl, and "20s" becomes a Duration.
 */
@ConfigurationProperties(prefix = "gemini")
public record GeminiProperties(String apiKey, String model, String baseUrl, Duration timeout) {

    public boolean hasApiKey() {
        return apiKey != null && !apiKey.isBlank();
    }

    /** A record's default toString prints every field; this one never prints the key. */
    @Override
    public String toString() {
        return "GeminiProperties[model=" + model + ", baseUrl=" + baseUrl + ", timeout=" + timeout
                + ", apiKey=" + (hasApiKey() ? "(set)" : "(missing)") + "]";
    }
}
