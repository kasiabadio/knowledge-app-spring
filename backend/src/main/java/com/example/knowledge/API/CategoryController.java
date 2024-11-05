package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.GlobalExceptionHandler;
import com.example.knowledge.models.Category;
import com.example.knowledge.services.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class CategoryController {

    private final CategoryService cs;

    public CategoryController(CategoryService cs){
        this.cs = cs;
    }

    @GetMapping
    public ResponseEntity<Category> getCategory(@RequestParam(value="id", required = false) Long id,
                                                @RequestParam(value="name", required = false) String categoryName){
        if (id != null){
            log.info("Controller: Getting Category entry: {}", id);
            return ResponseEntity.status(HttpStatus.OK).body(cs.getCategoryById(id));
        } else if (categoryName != null){
            log.info("Controller: Get category by name: {} ", categoryName);
            return ResponseEntity.status(HttpStatus.OK).body(cs.getCategoryByName(categoryName));
        } else {
            log.error("Controller: No id or name provided");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @GetMapping("searchAll/{phrase}")
    public ResponseEntity<List<Category>> findByCategoryName(@PathVariable String phrase) throws GlobalExceptionHandler.EmptyListException {
        if (phrase.trim().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.emptyList());
        }
        log.info("Controller: Getting Category entries: phrase: {}", phrase);
        return ResponseEntity.status(HttpStatus.OK).body(cs.findByCategoryName(phrase));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category){
        log.info("Controller: Creating new Category entry: {} {}", category.getIdCategory(), category.getCategoryName());
        return ResponseEntity.status(HttpStatus.OK).body(cs.createCategory(category));
    }


    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        log.info("Controller: Deleting Category entry: {}", id);
        cs.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories(){
        return ResponseEntity.status(HttpStatus.OK).body(cs.getAllCategories());
    }

}
