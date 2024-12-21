package com.example.knowledge.repositories;

import com.example.knowledge.models.CategoryKnowledgeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryKnowledgeGroupRepository extends JpaRepository<CategoryKnowledgeGroup, Long> {


}
