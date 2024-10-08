package com.example.knowledge.models;

import com.example.knowledge.keys.CategoryKnowledgeKey;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "CategoryKnowledgeGroup")
public class CategoryKnowledgeGroup  {

    @EmbeddedId
    CategoryKnowledgeKey groupId;

    @ManyToOne
    @MapsId("idCategory")
    @JoinColumn(name = "id_category")
    @JsonBackReference(value = "category-categoryKnowledgeGroup")
    Category category;

    @ManyToOne
    @MapsId("idKnowledge")
    @JoinColumn(name = "id_knowledge")
    @JsonBackReference(value = "knowledge-categoryKnowledgeGroup")
    Knowledge knowledge;

    public List<Knowledge> getKnowledgesByCategory(Category category, EntityManager entityManager){
        String query = "SELECT ck.knowledge FROM CategoryKnowledgeGroup ck WHERE ck.category = :category";
        return entityManager.createQuery(query, Knowledge.class)
                .setParameter("category", category)
                .getResultList();
    }

    public List<Category> getCategoriesByKnowledge(Knowledge knowledge, EntityManager entityManager){
        String query = "SELECT ck.category FROM CategoryKnowledgeGroup ck WHERE ck.knowledge = :knowledge";
        return entityManager.createQuery(query, Category.class)
                .setParameter("knowledge", knowledge)
                .getResultList();
    }

}
