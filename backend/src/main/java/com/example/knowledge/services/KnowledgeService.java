package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.*;
import com.example.knowledge.models.Dto.KnowledgeDto;
import com.example.knowledge.repositories.KnowledgeRepository;
import com.example.knowledge.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;


@Slf4j
@Service
public class KnowledgeService {

    private final KnowledgeRepository kr;
    private final UserRepository ur;
    private final CategoryService cs;
    private final CategoryKnowledgeGroupService ckgr;

    @Autowired
    public KnowledgeService(KnowledgeRepository kr,
                            UserRepository ur,
                            CategoryService cs,
                            CategoryKnowledgeGroupService ckgr){
        this.kr = kr;
        this.ur = ur;
        this.cs = cs;
        this.ckgr = ckgr;
    }

    public Set<Category> getAllCategories(Long knowledgeId){
        Knowledge knowledge = kr.findById(knowledgeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid knowledge ID"));

        Set<CategoryKnowledgeGroup> ckgs = knowledge.getCategories();
        Set<Category> categories = new HashSet<Category>();
        for (CategoryKnowledgeGroup ckg : ckgs) {
            categories.add(ckg.getCategory());
        }
        return categories;
    }

    public Set<Comment> getAllComments(Long knowledgeId){
        Knowledge knowledge = kr.findById(knowledgeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid knowledge ID"));

        return knowledge.getComments();
    }

    public Knowledge getKnowledgeById(Long id){
        log.info("Service: Getting Knowledge entry: {}", id);
        return kr.getByIdPublic(id).orElseThrow(() ->
                new EntityNotFoundException("Knowledge entity not found with id " + id));
    }

    public Long getAuthorId(Long knowledgeId){
        log.info("Service: Getting id of a user author for knowledge id: {}", knowledgeId);
        return kr.getAuthorId(knowledgeId);
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

        Knowledge knowledge = new Knowledge();
        knowledge.setTitle(knowledgeDto.getTitle());
        knowledge.setContent(knowledgeDto.getContent());
        knowledge.setUser(user);
        knowledge.setCreatedDate(new Date());
        knowledge.setLastModifiedDate(new Date());
        knowledge.setPublicKnowledge(knowledgeDto.getIsPublicKnowledge());

        if (knowledge.getCategories() == null) {
            knowledge.setCategories(new HashSet<>());
        }

        log.info("Service: Preparing Knowledge entry: {}", knowledge.getIdKnowledge());

        Knowledge savedKnowledge = kr.save(knowledge);

        for (Category category : categories) {
            CategoryKnowledgeGroup ckg = new CategoryKnowledgeGroup(category, savedKnowledge);
            ckgr.createCategoryKnowledgeGroupService(ckg);
            savedKnowledge.addCategory(ckg);
            category.addKnowledge(ckg);
        }

        user.addKnowledge(savedKnowledge);

        try {
            log.info("Service: Creating new Knowledge entry: {} {}", savedKnowledge.getIdKnowledge(), savedKnowledge.getTitle());
            return kr.save(savedKnowledge);
        } catch (Exception e) {
            log.error("Service: Error creating new Knowledge entry: {} {}", savedKnowledge.getIdKnowledge(), savedKnowledge.getTitle());
            throw new RuntimeException("Could not save Knowledge entity. Reason: " + e.getMessage(), e);
        }
    }

    public Knowledge updateKnowledge(KnowledgeDto knowledge, Long idKnowledge, List<Category> categories){
        log.info("Service: Trying to update knowledge with id: {}", idKnowledge);

        Knowledge k = kr.getByIdPublic(idKnowledge).orElseThrow(() -> new
                EntityNotFoundException("Knowledge entity not found with id: " +
                idKnowledge));

        User user = ur.findById(Math.toIntExact(knowledge.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        Date currentDate = new Date();
        k.setLastModifiedDate(currentDate);
        k.setCreatedDate(currentDate);

        k.setUser(user);
        k.setTitle(knowledge.getTitle());
        k.setContent(knowledge.getContent());
        k.setPublicKnowledge(knowledge.isPublicKnowledge());

        if (k.getCategories() == null) {
            k.setCategories(new HashSet<>());
        }

        log.info("Service: Preparing Knowledge entry: {}", k.getIdKnowledge());

        Knowledge savedKnowledge = kr.save(k);

        Set<CategoryKnowledgeGroup> currentCategories = new HashSet<>(k.getCategories());
        for (CategoryKnowledgeGroup category : currentCategories) {
            k.removeCategory(category);
            category.getCategory().removeKnowledge(category);
        }

        for (Category category : categories) {
            CategoryKnowledgeGroup ckg = new CategoryKnowledgeGroup(category, savedKnowledge);
            ckgr.createCategoryKnowledgeGroupService(ckg);
            savedKnowledge.addCategory(ckg);
            category.addKnowledge(ckg);
        }

        try {
            log.info("Service: Updating new Knowledge entry: {} {}", idKnowledge, knowledge.getTitle());
            return kr.save(k);
        } catch (Exception e){
            log.error("Service: Error updating new Knowledge entry: {} {}", idKnowledge, knowledge.getTitle());
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

