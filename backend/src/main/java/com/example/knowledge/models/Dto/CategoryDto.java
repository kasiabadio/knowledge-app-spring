package com.example.knowledge.models.Dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDto {
    private String categoryName;

    @Override
    public String toString(){
        return "CategoryDto{" +
                "categoryName=" + categoryName;
    }
}
