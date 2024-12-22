package com.example.knowledge.models;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_category")
    private Long idCategory;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(mappedBy = "category", orphanRemoval = true, cascade=CascadeType.REMOVE)
    Set<CategoryKnowledgeGroup> knowledges;

    @Override
    public boolean equals(Object o){
        if (this == o){
            return true;
        }
        if (o == null || getClass() != o.getClass()){
            return false;
        }
        Category category = (Category) o;
        return Objects.equals(idCategory, category.idCategory) &&
                Objects.equals(categoryName, category.categoryName) &&
                Objects.equals(knowledges, category.knowledges);
    }

    @Override
    public int hashCode(){
        return Objects.hash(idCategory, categoryName, knowledges);
    }

    @Override
    public String toString(){
        return "Category{" +
                "id=" + idCategory +
                ", category name=" + categoryName +
                ", categoryKnowledges size=" + knowledges.size();
    }
}
