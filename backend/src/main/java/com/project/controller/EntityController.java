package com.project.controller;

import com.project.service.EntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class EntityController {

    private final EntityService entityService;

    @Autowired
    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping("/entities")
    public Map<String, List<String>> getEntities() {
        String sampleText = "Apple is expanding in India and competing with Google";
        return entityService.extractEntities(sampleText);
    }
}
