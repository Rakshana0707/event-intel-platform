package com.project.extractor;

import java.util.List;

public abstract class EntityExtractor {
    
    /**
     * Extracts entities from the given text.
     * 
     * @param text The text to extract entities from.
     * @return A list of extracted entities.
     */
    public abstract List<String> extract(String text);
}
