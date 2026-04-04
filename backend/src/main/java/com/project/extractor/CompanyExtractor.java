package com.project.extractor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CompanyExtractor extends EntityExtractor {

    private static final List<String> COMPANIES = Arrays.asList(
            "Apple", "Google", "Microsoft", "Tesla", "Amazon"
    );

    @Override
    public List<String> extract(String text) {
        List<String> extractedCompanies = new ArrayList<>();
        
        if (text == null || text.isEmpty()) {
            return extractedCompanies;
        }

        for (String company : COMPANIES) {
            if (text.contains(company)) {
                extractedCompanies.add(company);
            }
        }

        return extractedCompanies;
    }
}
