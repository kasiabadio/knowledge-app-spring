package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.CategoryKnowledgeGroup;
import com.example.knowledge.repositories.CategoryKnowledgeGroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CategoryKnowledgeGroupService {

    private final CategoryKnowledgeGroupRepository ckgr;

    public CategoryKnowledgeGroupService(CategoryKnowledgeGroupRepository ckgr) {
        this.ckgr = ckgr;
    }

    public void createCategoryKnowledgeGroupService(CategoryKnowledgeGroup ckg){
        try {
            log.info("Service: Creating new CategoryKnowledgeGroup entry");
            ckgr.save(ckg);;
        } catch (Exception e){
            log.error("Service: Error creating new CategoryKnowledgeGroup entry");
            throw new RuntimeException("Could not save CategoryKnowledgeGroup entity. Reason: " + e.getMessage(), e);
        }

    }
}
