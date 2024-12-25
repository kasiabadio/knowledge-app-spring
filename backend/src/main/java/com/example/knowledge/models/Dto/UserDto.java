package com.example.knowledge.models.Dto;

import com.example.knowledge.models.Comment;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.models.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class UserDto {

    private String firstName;
    private String lastName;
    private String email;
    private boolean accountLocked;
    private boolean enabled;
    private List<Role> roles;
    private Set<Comment> comments;
    private Set<Knowledge> knowledges;

    @Override
    public String toString() {
        return "UserDto{" +
                "first name='" + firstName + '\'' +
                ", last name='" + lastName + '\'' +
                ", email=" + email +
                '}';
    }

}
