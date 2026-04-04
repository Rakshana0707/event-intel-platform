package com.project.util;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class TextParser {

    /**
     * Takes a long string of text and splits it into an individual list of words.
     */
    public List<String> splitIntoWords(String articleContent) {
        
        // 1. Check if the string is completely empty or null to avoid crashing
        if (articleContent == null || articleContent.trim().isEmpty()) {
            return Arrays.asList(); 
        }
        
        // 2. Clean up any trailing spaces and split the text into an Array.
        // The weird "\\s+" code inside split() tells Java to slice the string exactly 
        // wherever it sees one or more blank spaces, tabs, or new lines!
        String[] wordsArray = articleContent.trim().split("\\s+");
        
        // 3. Convert that raw Array into a modern Java List and return it
        return Arrays.asList(wordsArray);
    }
}
