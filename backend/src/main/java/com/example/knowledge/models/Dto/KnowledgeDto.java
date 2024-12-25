package com.example.knowledge.models.Dto;

import com.example.knowledge.models.CategoryKnowledgeGroup;
import lombok.Getter;

import java.util.Set;

@Getter
public class KnowledgeDto {
    private String title;
    private String content;
    private Long userId;

    @Override
    public String toString() {
        return "KnowledgeDto{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", userId=" + userId +
                '}';
    }
}
