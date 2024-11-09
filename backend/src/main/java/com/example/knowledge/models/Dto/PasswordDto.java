package com.example.knowledge.models.Dto;

import lombok.Getter;

@Getter
public class PasswordDto {
    private String oldPassword;
    private String token;
    private String newPassword;
}
