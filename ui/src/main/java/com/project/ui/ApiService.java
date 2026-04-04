package com.project.ui;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service to handle data fetching from the backend API.
 */
public class ApiService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Fetches articles from the backend.
     */
    public List<Article> fetchArticles() {
        String json = executeGetRequest("http://localhost:8080/all");
        try {
            if (json != null) {
                return objectMapper.readValue(json, new TypeReference<List<Article>>() {});
            }
        } catch (Exception e) {
            System.out.println("Error parsing articles: " + e.getMessage());
        }
        return null; // Return null to indicate failure
    }

    /**
     * Fetches trending words from the backend.
     */
    public Map<String, Integer> fetchTrends() {
        String json = executeGetRequest("http://localhost:8080/trends");
        try {
            if (json != null) {
                return objectMapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
            }
        } catch (Exception e) {
            System.out.println("Error parsing trends: " + e.getMessage());
        }
        return null; // Return null to indicate failure
    }

    /**
     * Common helper to execute a GET request and return the JSON string.
     */
    private String executeGetRequest(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                return response.toString();
            } else {
                System.out.println("GET request to " + urlString + " failed. Code: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
