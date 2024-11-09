package com.example.knowledge.repositories;

import com.example.knowledge.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    @Query("SELECT t FROM PasswordResetToken t WHERE t.token = :token")
    PasswordResetToken findByToken(@Param("token") String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user.idUser = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

    @Query("SELECT t FROM PasswordResetToken t WHERE t.user.idUser = :userId")
    Optional<PasswordResetToken> findByUserId(@Param("userId") Integer userId);
}
