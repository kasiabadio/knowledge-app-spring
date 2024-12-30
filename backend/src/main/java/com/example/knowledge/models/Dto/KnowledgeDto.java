package com.example.knowledge.models.Dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class KnowledgeDto {
    private String title;
    private String content;
    private Long userId;
    private Boolean isPublicKnowledge;

    @Override
    public String toString() {
        return "KnowledgeDto{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", userId=" + userId +
                '}';
    }


    public boolean isPublicKnowledge() {
        return isPublicKnowledge;
    }
}
