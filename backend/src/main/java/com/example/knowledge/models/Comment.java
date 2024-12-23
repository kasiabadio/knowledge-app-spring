package com.example.knowledge.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long groupId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "id_user")
    User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "id_knowledge")
    Knowledge knowledge;


}
