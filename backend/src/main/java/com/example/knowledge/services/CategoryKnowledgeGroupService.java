package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Category;
import com.example.knowledge.models.CategoryKnowledgeGroup;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.repositories.CategoryKnowledgeGroupRepository;
import com.example.knowledge.repositories.CategoryRepository;
import com.example.knowledge.repositories.KnowledgeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CategoryKnowledgeGroupService {

    private final CategoryKnowledgeGroupRepository ckgr;
    private final CategoryRepository cr;
    private final KnowledgeRepository kr;

    public CategoryKnowledgeGroupService(CategoryKnowledgeGroupRepository ckgr,
                                         CategoryRepository cr,
                                         KnowledgeRepository kr) {
        this.ckgr = ckgr;
        this.cr = cr;
        this.kr = kr;
    }

    public void createCategoryKnowledgeGroupService(CategoryKnowledgeGroup ckg){
        try {
            log.info("Service: Creating new CategoryKnowledgeGroup entry");
            ckgr.save(ckg);
        } catch (Exception e){
            log.error("Service: Error creating new CategoryKnowledgeGroup entry");
            throw new RuntimeException("Could not save CategoryKnowledgeGroup entity. Reason: " + e.getMessage(), e);
        }
    }

    public List<Knowledge> getAllKnowledgesFromCategory(String category){
        Category categoryObj = cr.findByName(category);
        List<CategoryKnowledgeGroup> ckgList = ckgr.getAllKnowledgeFromOneCategory(categoryObj.getIdCategory());
        List<Knowledge> knowledges = new ArrayList<Knowledge>();
        for (int i = 0; i < ckgList.size(); i++){
            Knowledge knowledge = ckgList.get(i).getKnowledge();
            if (knowledge.isPublicKnowledge()) {
                knowledges.add(knowledge);
            }
        }
        return knowledges;
    }
}
