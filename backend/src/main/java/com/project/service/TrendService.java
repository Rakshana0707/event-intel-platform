package com.project.service;

import com.project.trend.SimpleTrendStrategy;
import com.project.trend.TrendStrategy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TrendService {

    private final TrendStrategy trendStrategy;

    public TrendService() {
        // Utilizing the SimpleTrendStrategy we just created
        this.trendStrategy = new SimpleTrendStrategy();
    }

    public List<String> getTrendingWords(Map<String, Integer> oldData, Map<String, Integer> newData) {
        return new ArrayList<>(getTrendingWordFrequencies(oldData, newData).keySet());
    }

    public Map<String, Integer> getTrendingWordFrequencies(Map<String, Integer> oldData, Map<String, Integer> newData) {
        Map<String, Integer> trendingFrequencies = new HashMap<>();

        for (Map.Entry<String, Integer> entry : newData.entrySet()) {
            String word = entry.getKey();
            int newCount = entry.getValue();
            
            // Defaulting old count to 0 if the word is entirely new
            int oldCount = oldData.getOrDefault(word, 0);

            if (trendStrategy.isTrending(oldCount, newCount)) {
                trendingFrequencies.put(word, newCount);
            }
        }

        return trendingFrequencies;
    }

    public Map<String, Integer> getMockOldData() {
        Map<String, Integer> mockData = new HashMap<>();
        mockData.put("ai", 5);
        mockData.put("market", 3);
        mockData.put("war", 2);
        return mockData;
    }
}
