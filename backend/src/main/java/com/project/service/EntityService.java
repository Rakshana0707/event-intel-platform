package com.project.service;

import com.project.extractor.CompanyExtractor;
import com.project.extractor.LocationExtractor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EntityService {

    private final CompanyExtractor companyExtractor;
    private final LocationExtractor locationExtractor;

    public EntityService() {
        this.companyExtractor = new CompanyExtractor();
        this.locationExtractor = new LocationExtractor();
    }

    public Map<String, List<String>> extractEntities(String text) {
        Map<String, List<String>> entities = new HashMap<>();
        
        entities.put("companies", companyExtractor.extract(text));
        entities.put("locations", locationExtractor.extract(text));
        
        return entities;
    }
}
