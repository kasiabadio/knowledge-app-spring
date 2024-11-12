package com.example.knowledge.services;

import com.example.knowledge.models.PasswordResetToken;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.PasswordTokenRepository;
import com.example.knowledge.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataAccessException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;

import java.util.Date;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordTokenRepository passwordTokenRepository;
    private final UserRepository userRepository;
    private final MessageSource messageSource;
    private final PasswordEncoder passwordEncoder;


    public void createPasswordResetTokenForUser(User user, String token) throws Exception {

        try {
            Optional<PasswordResetToken> existingToken = passwordTokenRepository.findByUserId(user.getIdUser());

            // If a token exists, delete it
            existingToken.ifPresent(passwordTokenRepository::delete);

            // Create and save the new token
            PasswordResetToken newToken = new PasswordResetToken(token, user);
            newToken.setExpiryDate(new Date(System.currentTimeMillis() + 86400000)); // Set expiry date to 24 hours from now
            passwordTokenRepository.save(newToken);
        } catch (Exception e){
            throw new Exception("Error creating password reset token for user ID: " + user.getIdUser(), e);
        }

    }

    public User findUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail).orElseThrow(() -> new
                EntityNotFoundException("User not found with email " + userEmail ));
    }

    public SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, User user) throws Exception {
        try {
            String url = contextPath + "/changePassword?token=" + token;
            return constructEmail("Reset Password", url, user);
        } catch (Exception e){
            throw new Exception("Error creating reset token email for user ID: " + user.getIdUser(), e);
        }
    }

    private SimpleMailMessage constructEmail(String subject, String body, User user){
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getEmail());
        email.setFrom("kasia@mail.com");
        return email;
    }


    public Optional<User> getUserByPasswordResetToken(String token) {
        try {
            PasswordResetToken passwordResetToken = passwordTokenRepository.findByToken(token);
            if (passwordResetToken == null){
                throw new EntityNotFoundException("Invalid password reset Token");
            }
            return Optional.ofNullable(userRepository.findById(passwordResetToken.getUser().getIdUser()).orElseThrow(
                    () -> new EntityNotFoundException("User not found for the given token")));

        } catch (DataAccessException e){
            throw new ServiceException("Error accessing the database with token: " + token, e);
        }

    }

    public void changeUserPassword(User user, String password) throws Exception {
        try {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        } catch (Exception e) {
            throw new Exception("Error changing password for user ID: " + user.getIdUser(), e);
        }
    }
}
