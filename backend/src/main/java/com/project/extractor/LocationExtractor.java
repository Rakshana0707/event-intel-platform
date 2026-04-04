package com.project.extractor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class LocationExtractor extends EntityExtractor {

    private static final List<String> LOCATIONS = Arrays.asList(
            "India", "USA", "China", "Germany", "Japan"
    );

    @Override
    public List<String> extract(String text) {
        List<String> extractedLocations = new ArrayList<>();
        
        if (text == null || text.isEmpty()) {
            return extractedLocations;
        }

        for (String location : LOCATIONS) {
            if (text.contains(location)) {
                extractedLocations.add(location);
            }
        }

        return extractedLocations;
    }
}
