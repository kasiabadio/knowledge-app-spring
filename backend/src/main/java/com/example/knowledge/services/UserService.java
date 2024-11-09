package com.example.knowledge.services;

import com.example.knowledge.models.PasswordResetToken;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.PasswordTokenRepository;
import com.example.knowledge.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;

import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordTokenRepository passwordTokenRepository;
    private final UserRepository userRepository;
    private final MessageSource messageSource;
    private final PasswordEncoder passwordEncoder;


    public void createPasswordResetTokenForUser(User user, String token){
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordTokenRepository.save(myToken);
    }

    public User findUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail).orElseThrow(() -> new
                EntityNotFoundException("User not found with email " + userEmail ));
    }

    public SimpleMailMessage constructResetTokenEmail(String contextPath, Locale locale, String token, User user){
        String url = contextPath + "/changePassword?token=" + token;
        String message = messageSource.getMessage("message.resetPassword", null, locale);
        return constructEmail("Reset Password", message + " \r\n" + url, user);
    }

    private SimpleMailMessage constructEmail(String subject, String body, User user){
        SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getEmail());
        email.setFrom("support@mail.com");
        return email;
    }


    public Optional getUserByPasswordResetToken(String token) {
        return null;
    }

    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
