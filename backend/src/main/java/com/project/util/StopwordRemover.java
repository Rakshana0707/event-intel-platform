package com.project.util;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class StopwordRemover {

    // 1. Permanently define our list of "stop words"
    // (Words that are too common and don't add real meaning to a sentence)
    private static final List<String> STOP_WORDS = Arrays.asList(
            "is", "the", "a", "and", "of", "to", "in", "for", "on", "with", "it", "at"
    );

    /**
     * Takes an extracted list of string tokens and returns a new list with stop words filtered out.
     */
    public List<String> removeStopWords(List<String> rawTokens) {
        
        // 2. Create an empty list to hold only the useful words
        List<String> cleanedTokens = new ArrayList<>();
        
        // 3. Loop through every single word in the list the user provided
        for (String word : rawTokens) {
            
            // 4. Convert the word to lowercase so capitalized words like "The" are still caught!
            String lowerCaseWord = word.toLowerCase();
            
            // 5. If our STOP_WORDS list does NOT contain this word, it must be useful. Keep it!
            if (!STOP_WORDS.contains(lowerCaseWord)) {
                cleanedTokens.add(word); // We add the original, un-lowercased word to retain formatting
            }
        }
        
        // 6. Return the perfectly cleaned list of meaningful words!
        return cleanedTokens;
    }
}
