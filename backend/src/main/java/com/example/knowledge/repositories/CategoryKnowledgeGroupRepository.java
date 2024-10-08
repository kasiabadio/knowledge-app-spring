package com.example.knowledge.repositories;

import com.example.knowledge.keys.CategoryKnowledgeKey;
import com.example.knowledge.models.CategoryKnowledgeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryKnowledgeGroupRepository extends JpaRepository<CategoryKnowledgeGroup, CategoryKnowledgeKey> {

    @Query("SELECT ckg FROM CategoryKnowledgeGroup ckg WHERE ckg.groupId.idCategory = :categoryId")
    List<CategoryKnowledgeGroup> getCKGByCategory(@Param("categoryId") Long categoryId);

    @Query("SELECT ckg FROM CategoryKnowledgeGroup ckg WHERE ckg.groupId.idKnowledge = :knowledgeId")
    List<CategoryKnowledgeGroup> getCKGByKnowledge(@Param("knowledgeId") Long knowledgeId);

    @Query("SELECT ckg FROM CategoryKnowledgeGroup ckg WHERE ckg.category.categoryName = :categoryName AND ckg.groupId.idKnowledge = :knowledgeId")
    CategoryKnowledgeGroup getCKG(@Param("categoryName") String categoryName, @Param("knowledgeId") Long knowledgeId);
}
