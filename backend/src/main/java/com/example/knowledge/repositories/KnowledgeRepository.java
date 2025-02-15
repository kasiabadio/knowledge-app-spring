package com.example.knowledge.repositories;
import com.example.knowledge.models.Knowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeRepository extends JpaRepository<Knowledge, Long> {

    // -------------- PRIVATE KNOWLEDGE ------------------

    @Query("SELECT k FROM Knowledge k WHERE k.isPublicKnowledge = false AND k.idKnowledge = :idKnowledge AND k.user.idUser = :idUser")
    Knowledge getByIdPrivate(@Param("idUser") Long idUser, @Param("idKnowledge") Long idKnowledge);

    @Query("SELECT k FROM Knowledge k WHERE k.isPublicKnowledge = false AND k.user.idUser = :idUser")
    List<Knowledge> findAllPrivate(@Param("idUser") Long idUser);

    // --------------- PUBLIC KNOWLEDGE ------------------

    @Query("SELECT k FROM Knowledge k WHERE k.idKnowledge = :id")
    Optional<Knowledge> getByIdPublic(@Param("id") Long id);

    @Query("SELECT k FROM Knowledge k WHERE k.title LIKE %:phrase% AND k.isPublicKnowledge = true")
    List<Knowledge> findKnowledgeTitlePhrasePublic(@Param("phrase") String phrase);

    @Query("SELECT k FROM Knowledge k WHERE (k.title LIKE %:title% OR " +
            "k.content LIKE %:content%) " +
            " AND k.isPublicKnowledge = true")
    List<Knowledge> findByPublic(@Param("title") String title,
                           @Param("content") String content);

    @Query("SELECT k FROM Knowledge k WHERE k.isPublicKnowledge = true")
    List<Knowledge> findAllPublic();


    @Query("SELECT k.user.idUser FROM Knowledge k WHERE k.idKnowledge = :knowledgeId")
    Long getAuthorId(@Param("knowledgeId") Long knowledgeId);
}
