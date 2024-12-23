package com.example.knowledge.models.Dto;

import lombok.Getter;

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
