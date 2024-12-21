package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.CategoryKnowledgeGroup;
import com.example.knowledge.services.CategoryKnowledgeGroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/categories-knowledges")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class CategoryKnowledgeGroupController {
    private final CategoryKnowledgeGroupService ckgs;

    @Autowired
    public CategoryKnowledgeGroupController(CategoryKnowledgeGroupService ckgs){
        this.ckgs = ckgs;
    }

}
