package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.repositories.KnowledgeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class KnowledgeService {

    private final KnowledgeRepository kr;

    @Autowired
    public KnowledgeService(KnowledgeRepository kr){
        this.kr = kr;
    }

    public Knowledge getKnowledgeById(Long id){
        log.info("Service: Getting Knowledge entry: {}", id);
        return kr.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Knowledge entity not found with id " + id));
    }

    public List<Knowledge> getKnowledgeByTitleAndAuthor(String title, String author) throws GlobalExceptionHandler.EmptyListException {

        List<Knowledge> items = kr.findKnowledgeByTitleAndAuthor(title, author);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find knowledge entries with " + title + " and " + author);
        }
        log.info("Service: Getting Knowledge entry: title: {} author: {}", title, author);
        return items;
    }

    public List<Knowledge> getKnowledgeByTitlePhrase(String titlePhrase) throws GlobalExceptionHandler.EmptyListException {

        List<Knowledge> items = kr.findKnowledgeTitlePhrase(titlePhrase);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find knowledge entries with titlePhrase:  " + titlePhrase);
        }
        log.info("Service: Getting Knowledge entry: title phrase: {}", titlePhrase);
        return items;
    }

    public List<Knowledge> findBy(String title, String content, String author) throws GlobalExceptionHandler.EmptyListException {
        List<Knowledge> items =  kr.findBy(title, content, author);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find knowledge entries with phrase:  " + title);
        }
        return items;
    }

    public Knowledge createKnowledge(Knowledge knowledge){
        Date currentDate = new Date();
        knowledge.setCreatedDate(currentDate);
        knowledge.setLastModifiedDate(currentDate);
        try {
            log.info("Service: Creating new Knowledge entry: {} {}", knowledge.getIdKnowledge(), knowledge.getTitle());
            return kr.save(knowledge);
        } catch (Exception e){
            log.error("Service: Error creating new Knowledge entry: {} {}", knowledge.getIdKnowledge(), knowledge.getTitle());
            throw e;
        }
    }

    public Knowledge updateKnowledge(Knowledge knowledge){
        Knowledge k = kr.findById(knowledge.getIdKnowledge()).orElseThrow(() -> new
                EntityNotFoundException("Knowledge entity not found with id: " +
                knowledge.getIdKnowledge()));

        Date currentDate = new Date();
        k.setLastModifiedDate(currentDate);
        k.setIdKnowledge(knowledge.getIdKnowledge());
        k.setAuthor(knowledge.getAuthor());
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
        return kr.findAll();
    }

}

