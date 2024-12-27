package com.example.knowledge.services;

import com.example.knowledge.models.Comment;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.CommentRepository;
import com.example.knowledge.repositories.KnowledgeRepository;
import com.example.knowledge.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Date;

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
