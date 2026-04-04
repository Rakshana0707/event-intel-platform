package com.project.controller;

import com.project.service.TrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class TrendController {

    private final TrendService trendService;
    // Injecting ArticleController here as it currently contains the logic to analyze words
    private final ArticleController analysisService;

    @Autowired
    public TrendController(TrendService trendService, ArticleController analysisService) {
        this.trendService = trendService;
        this.analysisService = analysisService;
    }

    @GetMapping("/trends")
    public Map<String, Integer> getTrends() {
        // 1. Get current word frequency from analysis service (ArticleController's analyze method)
        Map<String, Integer> currentData = analysisService.analyzeAllArticles();

        // 2. Get mock old data
        Map<String, Integer> oldData = trendService.getMockOldData();

        // 3. Compare using TrendService and return frequencies
        return trendService.getTrendingWordFrequencies(oldData, currentData);
    }
}
