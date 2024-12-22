package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.services.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RequestMapping("/api/comments")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class CommentController {

    private final CommentService cs;

    @Autowired
    public CommentController(CommentService cs){
        this.cs = cs;
    }


}
