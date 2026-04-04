package com.project.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import com.project.entity.Article;
import com.project.repository.ArticleRepository;

@Service
public class NewsService {

    @Autowired
    private ArticleRepository articleRepository;

    // 1. Create a simple blueprint for the incoming JSON data
    // (We make this 'public' so Spring's automatic JSON converter can read it)
    public static class NewsDto {
        public String title;
        public String body; // JSONPlaceholder uses 'body', which we will treat as the description
    }

    public List<Article> fetchNewsAndSave() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://jsonplaceholder.typicode.com/posts";
        
        NewsDto[] responseArray = restTemplate.getForObject(url, NewsDto[].class);
        
        List<Article> savedArticles = new ArrayList<>();
        
        if (responseArray != null) {
            for (int i = 0; i < 5 && i < responseArray.length; i++) {
                NewsDto news = responseArray[i];
                
                // 1. Create a real database Article entity
                Article newArticle = new Article(news.title, news.body);
                
                // 2. Save it directly to MySQL using the Repository!
                Article saved = articleRepository.save(newArticle);
                
                savedArticles.add(saved);
            }
        }
        
        return savedArticles;
    }
}
