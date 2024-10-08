package com.example.knowledge.keys;

import com.example.knowledge.models.Category;
import com.example.knowledge.models.Knowledge;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Embeddable
public class CategoryKnowledgeKey implements Serializable {

    @Column(name = "id_category")
    private Long idCategory;

    @Column(name = "id_knowledge")
    private Long idKnowledge;
}
