package com.project.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.entity.Article;
import com.project.repository.ArticleRepository;
import com.project.service.NewsService;
import com.project.util.StopwordRemover;
import com.project.util.TextParser;
import com.project.util.WordFrequencyCounter;

@RestController
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private NewsService newsService;

    @Autowired
    private TextParser textParser;

    @Autowired
    private StopwordRemover stopwordRemover;

    @Autowired
    private WordFrequencyCounter wordFrequencyCounter;

    // 1. Fetch all articles
    @GetMapping("/all")
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // 2. Save a new article
    @PostMapping("/add")
    public Article saveArticle(@RequestBody Article article) {
        return articleRepository.save(article);
    }

    // 3. Fetch from API and save to DB
    @GetMapping("/fetch-news")
    public List<Article> getParsedNewsData() {
        return newsService.fetchNewsAndSave();
    }

    // 4. Analyze word frequency across all articles
    @GetMapping("/analyze")
    public Map<String, Integer> analyzeAllArticles() {
        
        // Step A: Fetch all articles from the MySQL database
        List<Article> allArticles = articleRepository.findAll();
        
        // Step B: Collect every single word from every article into one giant list
        List<String> allTokens = new ArrayList<>();
        for (Article article : allArticles) {
            if (article.getContent() != null) {
                // Use our new TextParser tool to slice up the content
                List<String> articleWords = textParser.splitIntoWords(article.getContent());
                allTokens.addAll(articleWords);
            }
        }
        
        // Step C: Filter out all the boring "stop words" using our other tool
        List<String> meaningfulWords = stopwordRemover.removeStopWords(allTokens);
        
        // Step D: Count exactly how many times each meaningful word appears
        return wordFrequencyCounter.countWordFrequencies(meaningfulWords);
    }
}
