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

    @Autowired
    public CategoryKnowledgeGroupService(CategoryKnowledgeGroupRepository ckgr){
        this.ckgr = ckgr;
    }

    public List<CategoryKnowledgeGroup> getCategoryKnowledgeGroupByCategory(Long categoryId) throws GlobalExceptionHandler.EmptyListException {
        List<CategoryKnowledgeGroup> items = ckgr.getCKGByCategory(categoryId);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find CategoryKnowledgeGroupEntries with category Id: " + categoryId);
        }
        return items;
    }

    public List<CategoryKnowledgeGroup> getCategoryKnowledgeGroupByKnowledge(Long knowledgeId) throws GlobalExceptionHandler.EmptyListException {
        List<CategoryKnowledgeGroup> items = ckgr.getCKGByKnowledge(knowledgeId);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find CategoryKnowledgeGroupEntries with knowledge Id: " + knowledgeId);
        }
        return items;
    }

    public CategoryKnowledgeGroup getCategoryKnowledgeGroup(String categoryId, Long knowledgeId){
        return ckgr.getCKG(categoryId, knowledgeId);
    }

    public CategoryKnowledgeGroup createCategoryKnowledgeGroup(CategoryKnowledgeGroup ckg){
        try {
            log.info("Service: Creating new CategoryKnowledgeGroup entry");
            return ckgr.save(ckg);
        } catch (Exception e){
            log.info("Service: error creating new CategoryKnowledgeGroup entry");
            throw e;
        }
    }
}
