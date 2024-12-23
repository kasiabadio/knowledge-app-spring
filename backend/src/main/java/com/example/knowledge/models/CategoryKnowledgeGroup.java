package com.example.knowledge.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "categoryKnowledgeGroup")
public class CategoryKnowledgeGroup  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long groupId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "id_category")
    Category category;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "id_knowledge")
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
