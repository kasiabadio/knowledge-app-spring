package com.example.knowledge.services.mapper;

import com.example.knowledge.models.Category;
import com.example.knowledge.models.Dto.CategoryDto;

public class CategoryMapper {

    public static CategoryDto mapToCategoryDto(Category category){
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setCategoryName(categoryDto.getCategoryName());
        return categoryDto;
    }

    public static Category mapToCategory(CategoryDto categoryDto){
        Category category = new Category();
        category.setCategoryName(categoryDto.getCategoryName());
        return category;
    }
}
