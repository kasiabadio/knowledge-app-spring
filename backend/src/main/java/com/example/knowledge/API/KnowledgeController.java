package com.example.knowledge.API;
import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Category;
import com.example.knowledge.models.Comment;
import com.example.knowledge.models.Dto.KnowledgeDto;
import com.example.knowledge.repositories.CategoryRepository;
import com.example.knowledge.services.KnowledgeService;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class KnowledgeController {

    private final KnowledgeService ks;
    private final CategoryRepository cr;
    private final UserService us;

    @Autowired
    public KnowledgeController(KnowledgeService ks, CategoryRepository cr, UserService us){
        this.ks = ks;
        this.cr = cr;
        this.us = us;
    }

    @GetMapping("/getAllCategories/{knowledgeId}")
    public ResponseEntity<List<Category>> getAllCategories(@PathVariable Long knowledgeId) {
        log.info("Controller: Getting all Categories for Knowledge: {}", knowledgeId);

        Set<Category> categoriesSet = ks.getAllCategories(knowledgeId);
        List<Category> categoriesList = new ArrayList<>(categoriesSet);

        return ResponseEntity.status(HttpStatus.OK).body(categoriesList);
    }

    @GetMapping("/getAllComments/{knowledgeId}")
    public ResponseEntity<List<Comment>> getAllComments(@PathVariable Long knowledgeId) {
        log.info("Controller: Getting all Comments for Knowledge: {}", knowledgeId);

        Set<Comment> commentSet = ks.getAllComments(knowledgeId);
        List<Comment> commentList = new ArrayList<>(commentSet);

        return ResponseEntity.status(HttpStatus.OK).body(commentList);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Knowledge> getKnowledgeById(@PathVariable Long id){
        log.info("Controller: Getting Knowledge entry: {}", id);
        return ResponseEntity.status(HttpStatus.OK).body(ks.getKnowledgeById(id));
    }

    @GetMapping("/getAuthorEmail/{idKnowledge}")
    public ResponseEntity<Long> getAuthorId(@PathVariable Long idKnowledge){
        log.info("Controller: Getting Email of a author of knowledge with id: {}", idKnowledge);
        return ResponseEntity.status(HttpStatus.OK).body(ks.getAuthorId(idKnowledge));
    }

    @GetMapping("searchByPhrase/{titlePhrase}")
    public ResponseEntity<List<Knowledge>> getKnowledgeByTitlePhrase(@PathVariable String titlePhrase) throws GlobalExceptionHandler.EmptyListException {
        log.info("Controller: Attempt to get Knowledge entries by title phrase: {}", titlePhrase);
        if (titlePhrase.trim().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.emptyList());
        }
        log.info("Controller: Getting Knowledge entries: title phrase: {}", titlePhrase);
        return ResponseEntity.status(HttpStatus.OK).body(ks.getKnowledgeByTitlePhrase(titlePhrase));
    }

    @GetMapping("searchAllByPhrase/{phrase}")
    public ResponseEntity<List<Knowledge>> findBy(@PathVariable String phrase) throws GlobalExceptionHandler.EmptyListException {
        if (phrase.trim().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.emptyList());
        }
        log.info("Controller: Getting Knowledge entries: phrase: {}", phrase);
        return ResponseEntity.status(HttpStatus.OK).body(ks.findBy(phrase, phrase));
    }

    @PostMapping("/add")
    public ResponseEntity<Knowledge> createKnowledge(@RequestBody KnowledgeDto knowledgeDto,
                                                     @RequestParam List<String> categories){

        if (knowledgeDto == null || categories == null || categories.isEmpty()) {
            log.error("Invalid input: knowledgeDto or categories are null/empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(null);
        }

        try{
            log.info("Controller: Creating new Knowledge entry: {}", knowledgeDto.getTitle());
            log.info("Received categories: {}", categories);
            log.info("Categories.length: {}", categories.size());
            log.info("isPublicKnowledge: {}", knowledgeDto.getIsPublicKnowledge());

            List<Category> categoryObjects = categories.stream()
                    .map(cr::findByName)
                    .collect(Collectors.toList());

            Knowledge knowledgeNew = ks.createKnowledge(knowledgeDto, categoryObjects);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(knowledgeNew);
        } catch (Exception e) {
            log.error("Controller exception of creating new knowledge: " + e.getMessage());
            throw e;
        }
    }

    @PutMapping("/update/{idKnowledge}")
    public ResponseEntity<Knowledge> updateKnowledge(@RequestBody KnowledgeDto knowledge,
                                                     @PathVariable Long idKnowledge,
                                                     @RequestParam String categories){

        if (categories == null || categories.isEmpty()) {
            log.error("Categories parameter is missing or empty.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        log.info("Controller: Trying to update knowledge with id: {}", idKnowledge);
        List<String> categoryList = Arrays.asList(categories.split(","));

        List<Category> categoryObjects = categoryList.stream()
                .map(cr::findByName)
                .collect(Collectors.toList());

        Knowledge updatedKnowledge = ks.updateKnowledge(knowledge, idKnowledge, categoryObjects);
        if (updatedKnowledge != null){
            log.info("Controller: Updating Knowledge entry: {} {}", idKnowledge, knowledge.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedKnowledge);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteKnowledge(@PathVariable Long id){
        log.info("Controller: Deleting Knowledge entry: {}", id);
        ks.deleteKnowledge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Knowledge>> getAllKnowledge() {
        log.info("Controller: Getting all knowledge");
        List<Knowledge> knowledgeList = ks.getAllKnowledge();
        if (knowledgeList == null) {
            knowledgeList = new ArrayList<>();
        }
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(knowledgeList);
    }


}
