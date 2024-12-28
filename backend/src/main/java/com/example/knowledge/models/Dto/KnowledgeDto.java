package com.example.knowledge.models.Dto;

import com.example.knowledge.models.CategoryKnowledgeGroup;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

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
