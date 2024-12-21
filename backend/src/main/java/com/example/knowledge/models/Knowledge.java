package com.example.knowledge.models;
import java.io.Serializable;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "knowledge")
public class Knowledge implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_knowledge")
    private Long idKnowledge;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "last_modified_date")
    private Date lastModifiedDate;

    @Column(name = "author")
    private String author;

    @OneToMany(orphanRemoval = true, cascade=CascadeType.REMOVE, mappedBy = "knowledge") @JsonManagedReference(value = "knowledge-categoryKnowledgeGroup")
    Set<CategoryKnowledgeGroup> knowledgeCategories;

    @OneToMany(mappedBy = "knowledge")
    Set<Comment> commentsUnderKnowledge;

    @Override
    public boolean equals(Object o){
        if (this == o){
            return true;
        }
        if (o == null || getClass() != o.getClass()){
            return false;
        }
        Knowledge knowledge = (Knowledge) o;
        return Objects.equals(idKnowledge, knowledge.idKnowledge) &&
                Objects.equals(title, knowledge.title) &&
                Objects.equals(content, knowledge.content) &&
                Objects.equals(createdDate, knowledge.createdDate) &&
                Objects.equals(lastModifiedDate, knowledge.lastModifiedDate) &&
                Objects.equals(author, knowledge.author);
    }

    @Override
    public int hashCode(){
        return Objects.hash(idKnowledge, title, content, createdDate, lastModifiedDate, author);
    }

    @Override
    public String toString(){
        return "Knowledge{" +
                "id=" + idKnowledge +
                ", title=" + title +
                ", content=" + content +
                ", createdDate=" + createdDate +
                ", lastModifiedDate=" + lastModifiedDate +
                ", author=" + author +
                '}';
    }

}
