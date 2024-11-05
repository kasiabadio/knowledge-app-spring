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

    @GetMapping("/by-category/{categoryId}")
    public List<CategoryKnowledgeGroup> getCategoryKnowledgeGroupsByCategory(@PathVariable Long categoryId) throws GlobalExceptionHandler.EmptyListException {
        log.info("Controller: Getting CategoryKnowledgeGroup entry by category id: {}", categoryId);
        return ckgs.getCategoryKnowledgeGroupByCategory(categoryId);
    }

    @GetMapping("/by-knowledge/{knowledgeId}")
    public List<CategoryKnowledgeGroup> getCategoryKnowledgeGroupByKnowledge(@PathVariable Long knowledgeId) throws GlobalExceptionHandler.EmptyListException {
        log.info("Controller: Getting CategoryKnowledgeGroup entry by knowledge id: {}", knowledgeId);
        return ckgs.getCategoryKnowledgeGroupByKnowledge(knowledgeId);
    }

    @GetMapping("/element/{categoryName}/{knowledgeId}")
    public CategoryKnowledgeGroup getCategoryKnowledgeGroup(@PathVariable String categoryName, @PathVariable Long knowledgeId){
        log.info("Controller: Getting CategoryKnowledgeGroup entry: category id {} knowledge id {}", categoryName, knowledgeId);
        return ckgs.getCategoryKnowledgeGroup(categoryName, knowledgeId);
    }

    @PostMapping
    public ResponseEntity<CategoryKnowledgeGroup> createCategoryKnowledgeGroup(@RequestBody CategoryKnowledgeGroup ckg){
        CategoryKnowledgeGroup ckgNew = ckgs.createCategoryKnowledgeGroup(ckg);
        if (ckgNew != null){
            log.info("Controller: Creating new CategoryKnowledgeGroup: category name: {} knowledge title: {}", ckg.getCategory().getCategoryName(), ckg.getKnowledge().getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(ckgNew);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
