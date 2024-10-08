package com.example.knowledge.services;

import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Category;
import com.example.knowledge.repositories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CategoryService {

    private final CategoryRepository cr;

    @Autowired
    public CategoryService(CategoryRepository cr){
        this.cr = cr;
    }

    public Category getCategoryById(Long id){
        log.info("Service: Getting Category entry by id: {}", id);
        return cr.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Category entry not found with id " + id));
    }

    public Category getCategoryByName(String categoryName){
        log.info("Service: Getting Category entry by name: {}", categoryName);
        return cr.findByAllCategoryName(categoryName);
    }


    public List<Category> findByCategoryName(String phrase) throws GlobalExceptionHandler.EmptyListException {
        List<Category> items = cr.findByCategoryName(phrase);
        if (items.isEmpty()){
            throw new GlobalExceptionHandler.EmptyListException("Can't find category entries with phrase: " + phrase);
        }
        return items;
    }

    public Category createCategory(Category category){
        log.info("Service: Creating new Category entry: {} {}", category.getIdCategory(), category.getCategoryName());
        return cr.save(category);
    }

    public void deleteCategory(Long id){
        cr.deleteById(id);
        log.info("Service: Deleting Category entry: {}", id);
    }

    public List<Category> getAllCategories(){
        return cr.findAll();
    }

}
