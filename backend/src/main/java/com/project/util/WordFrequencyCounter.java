package com.project.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WordFrequencyCounter {

    /**
     * Takes a list of words and uses a HashMap to count how many times each word appears.
     */
    public Map<String, Integer> countWordFrequencies(List<String> words) {
        
        // 1. Create our empty HashMap to act as a digital tally counter
        Map<String, Integer> frequencyMap = new HashMap<>();
        
        // 2. Loop through every single word in the list provided to us
        for (String word : words) {
            
            // Standardize the word to lowercase so "Apple" and "apple" get counted together
            String lowerCaseWord = word.toLowerCase();
            
            // 3. The Core Logic: Check if we have already seen this word before
            if (frequencyMap.containsKey(lowerCaseWord)) {
                // If we HAVE seen it: Grab its current total, add 1, and put it back
                int currentCount = frequencyMap.get(lowerCaseWord);
                frequencyMap.put(lowerCaseWord, currentCount + 1);
                
            } else {
                // If we have NEVER seen it: Add it to the map for the first time with a count of 1
                frequencyMap.put(lowerCaseWord, 1);
            }
        }
        
        // 4. Return the finished Map with all the final totals
        return frequencyMap;
    }
}
