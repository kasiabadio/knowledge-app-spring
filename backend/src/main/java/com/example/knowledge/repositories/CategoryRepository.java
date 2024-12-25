package com.example.knowledge.repositories;

import com.example.knowledge.models.Category;
import com.example.knowledge.models.Knowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.categoryName = :phrase")
    List<Category> findByCategoryName(@Param("phrase") String phrase);

    @Query("SELECT c FROM Category c WHERE c.categoryName = :phrase")
    Category findByName(@Param("phrase") String categoryName);


    @Query("SELECT c FROM Category c WHERE c.categoryName = categoryName")
    Category findByAllCategoryName(@Param("categoryName") String categoryName);

}
