package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Category;
import com.example.knowledge.models.CategoryKnowledgeGroup;
import com.example.knowledge.models.Dto.KnowledgeDto;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.KnowledgeRepository;
import com.example.knowledge.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
public class KnowledgeService {

    private final KnowledgeRepository kr;
    private final UserRepository ur;
    private final CategoryKnowledgeGroupService ckgr;

    @Autowired
    public KnowledgeService(KnowledgeRepository kr,
                            UserRepository ur,
                            CategoryKnowledgeGroupService ckgr){
        this.kr = kr;
        this.ur = ur;
        this.ckgr = ckgr;
    }

    public Knowledge getKnowledgeById(Long id){
        log.info("Service: Getting Knowledge entry: {}", id);
        return kr.getByIdPublic(id).orElseThrow(() ->
                new EntityNotFoundException("Knowledge entity not found with id " + id));
    }


    public List<Knowledge> getKnowledgeByTitlePhrase(String titlePhrase) throws GlobalExceptionHandler.EmptyListException {

        log.info("Service: Attempt to search by title phrase: {}", titlePhrase);
        List<Knowledge> items = kr.findKnowledgeTitlePhrasePublic(titlePhrase);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find knowledge entries with titlePhrase:  " + titlePhrase);
        }
        log.info("Service: Getting Knowledge entry: title phrase: {}", titlePhrase);
        return items;
    }

    public List<Knowledge> findBy(String title, String content) throws GlobalExceptionHandler.EmptyListException {
        List<Knowledge> items =  kr.findByPublic(title, content);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find knowledge entries with phrase:  " + title);
        }
        return items;
    }

    public Knowledge createKnowledge(KnowledgeDto knowledgeDto, List<Category> categories) {
        User user = ur.findById(Math.toIntExact(knowledgeDto.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        // Create and initialize the Knowledge object
        Knowledge knowledge = new Knowledge();
        knowledge.setTitle(knowledgeDto.getTitle());
        knowledge.setContent(knowledgeDto.getContent());
        knowledge.setUser(user);
        knowledge.setCreatedDate(new Date());
        knowledge.setLastModifiedDate(new Date());

        // Ensure the categories field is initialized
        if (knowledge.getCategories() == null) {
            knowledge.setCategories(new HashSet<>());
        }

        log.info("Service: Preparing Knowledge entry: {}", knowledge.getIdKnowledge());

        // Save Knowledge first to make it persistent
        Knowledge savedKnowledge = kr.save(knowledge);

        // Add categories to knowledge and link knowledge to categories
        for (Category category : categories) {
            // Create CategoryKnowledgeGroup
            CategoryKnowledgeGroup ckg = new CategoryKnowledgeGroup(category, savedKnowledge);

            // Save the CategoryKnowledgeGroup
            ckgr.createCategoryKnowledgeGroupService(ckg);

            // Link the CategoryKnowledgeGroup with Knowledge and Category
            savedKnowledge.addCategory(ckg);
            category.addKnowledge(ckg);
        }

        // Link the Knowledge object to the User
        user.addKnowledge(savedKnowledge);

        try {
            // Update and save the Knowledge object with all relationships
            log.info("Service: Creating new Knowledge entry: {} {}", savedKnowledge.getIdKnowledge(), savedKnowledge.getTitle());
            return kr.save(savedKnowledge);
        } catch (Exception e) {
            log.error("Service: Error creating new Knowledge entry: {} {}", savedKnowledge.getIdKnowledge(), savedKnowledge.getTitle());
            throw new RuntimeException("Could not save Knowledge entity. Reason: " + e.getMessage(), e);
        }
    }

    public Knowledge updateKnowledge(Knowledge knowledge){
        Knowledge k = kr.getByIdPublic(knowledge.getIdKnowledge()).orElseThrow(() -> new
                EntityNotFoundException("Knowledge entity not found with id: " +
                knowledge.getIdKnowledge()));

        Date currentDate = new Date();
        k.setLastModifiedDate(currentDate);
        k.setIdKnowledge(knowledge.getIdKnowledge());
        k.setUser(knowledge.getUser());
        k.setTitle(knowledge.getTitle());
        k.setContent(knowledge.getContent());
        try {
            log.info("Service: Updating new Knowledge entry: {} {}", knowledge.getIdKnowledge(), knowledge.getTitle());
            return kr.save(k);
        } catch (Exception e){
            log.error("Service: Error updating new Knowledge entry: {} {}", knowledge.getIdKnowledge(), knowledge.getTitle());
            throw e;
        }
    }

    public void deleteKnowledge(Long id){
        kr.deleteById(id);
        log.info("Service: Deleting Knowledge entry: {}", id);
    }

    public List<Knowledge> getAllKnowledge() {
        return kr.findAllPublic();
    }

}

