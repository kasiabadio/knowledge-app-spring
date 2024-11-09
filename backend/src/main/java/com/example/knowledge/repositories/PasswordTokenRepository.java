package com.example.knowledge.repositories;

import com.example.knowledge.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Integer> {


    PasswordResetToken findByToken(String token);
}
