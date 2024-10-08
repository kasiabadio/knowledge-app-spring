package com.example.knowledge.repositories;
import com.example.knowledge.models.Knowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeRepository extends JpaRepository<Knowledge, Long> {

    List<Knowledge> findKnowledgeByTitleAndAuthor(String title, String author);

    @Query("SELECT k FROM Knowledge k WHERE k.title LIKE %:phrase%")
    List<Knowledge> findKnowledgeTitlePhrase(@Param("phrase") String phrase);

    @Query("SELECT k FROM Knowledge k WHERE k.title LIKE %:title% OR " +
            "k.content LIKE %:content% OR " +
            "k.author LIKE %:author%")
    List<Knowledge> findBy(@Param("title") String title,
                           @Param("content") String content,
                           @Param("author") String author);
}
