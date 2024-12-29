package com.example.knowledge.models;
import java.io.Serializable;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
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

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    @Column(name = "isPublicKnowledge")
    @JsonProperty("isPublicKnowledge")
    private boolean isPublicKnowledge;

    @JsonBackReference
    @OneToMany(mappedBy = "knowledge", cascade=CascadeType.REMOVE, orphanRemoval = true)
    Set<CategoryKnowledgeGroup> categories;

    @JsonBackReference
    @OneToMany(mappedBy = "knowledge", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Comment> comments;

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
                Objects.equals(user, knowledge.user);
    }

    @Override
    public int hashCode(){
        return Objects.hash(idKnowledge, title, content, createdDate, lastModifiedDate, user);
    }

    @Override
    public String toString(){
        return "Knowledge{" +
                "id=" + idKnowledge +
                ", title=" + title +
                ", content=" + content +
                ", createdDate=" + createdDate +
                ", lastModifiedDate=" + lastModifiedDate +
                ", author=" + user.fullName() +
                '}';
    }


    public void addComment(Comment comment){
        if (this.comments == null) {
            this.comments = new HashSet<>();
        }
        comments.add(comment);
        comment.setKnowledge(this);
    }

    public void removeComment(Comment comment){
        comments.remove(comment);
        comment.setKnowledge(null);
    }

    public void addCategory(CategoryKnowledgeGroup ckg){
        if (this.categories == null) {
            this.categories = new HashSet<>();
        }
        categories.add(ckg);
        ckg.setKnowledge(this);
    }

    public void removeCategory(CategoryKnowledgeGroup ckg){
        categories.remove(ckg);
        ckg.setKnowledge(null);
    }

}
