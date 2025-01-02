package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.models.Comment;
import com.example.knowledge.services.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/api/comments")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
@RestController
public class CommentController {

    private final CommentService cs;

    @Autowired
    public CommentController(CommentService cs){
        this.cs = cs;
    }


    @GetMapping("allCommentsForUser/{idUser}")
    public ResponseEntity<List<Comment>> allCommentsForUser(@PathVariable Long idUser){
        log.info("Controller: Getting Comment for user: {}", idUser);
        return ResponseEntity.status(HttpStatus.OK).body(cs.allCommentsForUser(idUser));
    }

    @DeleteMapping("delete/{idUser}/{idKnowledge}/{idComment}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long idUser, @PathVariable Long idKnowledge, @PathVariable Long idComment){
        log.info("Controller: Deleting Knowledge entry: {}", idComment);
        cs.deleteComment(idUser, idKnowledge, idComment);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("add/{idUser}/{idKnowledge}/{content}")
    public ResponseEntity<Comment> createComment(@PathVariable Long idUser, @PathVariable Long idKnowledge, @PathVariable String content){
        if (idUser == null || idKnowledge == null){
            log.error("Null idUser of idKnowledge");
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(null);
        }

        try {
            log.info("Controller: Creating new Comment entry: {}", content);
            Comment commentNew = cs.createComment(idUser, idKnowledge, content);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(commentNew);

        } catch (Exception e){
            log.error("Controller: Exception creating new comment: " + e.getMessage());
            throw e;
        }

    }

}
