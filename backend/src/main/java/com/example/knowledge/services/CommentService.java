package com.example.knowledge.services;

import com.example.knowledge.models.Comment;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.CommentRepository;
import com.example.knowledge.repositories.KnowledgeRepository;
import com.example.knowledge.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Comments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class CommentService {

    private final UserRepository ur;
    private final KnowledgeRepository kr;
    private final CommentRepository cr;

    @Autowired
    public CommentService(
            UserRepository ur,
            KnowledgeRepository kr,
            CommentRepository cr
    ){
        this.ur = ur;
        this.kr = kr;
        this.cr = cr;
    }

    public void deleteAllCommentsForAKnowledge(Long idKnowledge){
        Knowledge knowledge = kr.findById(idKnowledge)
                .orElseThrow(() -> new IllegalArgumentException("Invalid knowledge ID"));
        Set<Comment> comments = knowledge.getComments();
        for (Comment comment: comments){
            knowledge.removeComment(comment);
            comment.setKnowledge(null);
        }
    }

    public void deleteComment(Long idUser, Long idKnowledge, Long idComment){
        User user = ur.findById(Math.toIntExact(idUser))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        Knowledge knowledge = kr.findById(idKnowledge)
                .orElseThrow(() -> new IllegalArgumentException("Invalid knowledge ID"));

        Comment comment = cr.findById(idComment)
                .orElseThrow(() -> new IllegalArgumentException("Invalid comment ID"));

        // Check if the comment belongs to the given user and knowledge
        if (knowledge.getComments().contains(comment) && user.getComments().contains(comment)) {
            // Remove the comment from knowledge and user
            knowledge.removeComment(comment);
            user.removeComment(comment);

            // Optionally delete the comment from the repository
            cr.delete(comment);
        } else {
            throw new IllegalStateException("Comment does not belong to the given user or knowledge");
        }
    }

    public Comment createComment(Long idUser, Long idKnowledge, String content){
        User user = ur.findById(Math.toIntExact(idUser))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        Knowledge knowledge = kr.findById(idKnowledge)
                .orElseThrow(() -> new IllegalArgumentException("Invalid knowledge ID"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setKnowledge(knowledge);
        comment.setContent(content);

        comment.setCreatedDate(LocalDateTime.now());
        comment.setLastModifiedDate(LocalDateTime.now());

        Comment savedComment = cr.save(comment);

        knowledge.addComment(savedComment);
        user.addComment(savedComment);

        return savedComment;

    }
}
