package com.example.knowledge.API;
import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Dto.KnowledgeDto;
import com.example.knowledge.services.KnowledgeService;
import com.example.knowledge.models.Knowledge;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class KnowledgeController {

    private final KnowledgeService ks;

    @Autowired
    public KnowledgeController(KnowledgeService ks){
        this.ks = ks;
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Knowledge> getKnowledgeById(@PathVariable Long id){
        log.info("Controller: Getting Knowledge entry: {}", id);
        return ResponseEntity.status(HttpStatus.OK).body(ks.getKnowledgeById(id));
    }

    @GetMapping("searchByPhrase/{titlePhrase}")
    public ResponseEntity<List<Knowledge>> getKnowledgeByTitlePhrase(@PathVariable String titlePhrase) throws GlobalExceptionHandler.EmptyListException {
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
    public ResponseEntity<Knowledge> createKnowledge(@RequestBody KnowledgeDto knowledgeDto){
        log.info("Saving Knowledge: {}", knowledgeDto);

        try{
            Knowledge knowledgeNew = ks.createKnowledge(knowledgeDto);
            log.info("Controller: Creating new Knowledge entry: {}", knowledgeDto.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(knowledgeNew);
        } catch (Exception e) {
            log.error("Controller exception of creating new knowledge: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Knowledge> updateKnowledge(@RequestBody Knowledge knowledge){
        Knowledge updatedKnowledge = ks.updateKnowledge(knowledge);
        if (updatedKnowledge != null){
            log.info("Controller: Updating Knowledge entry: {} {}", knowledge.getIdKnowledge(), knowledge.getTitle());
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
