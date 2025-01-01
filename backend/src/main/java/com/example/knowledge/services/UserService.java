package com.example.knowledge.services;

import com.example.knowledge.models.Dto.UserDto;
import com.example.knowledge.models.PasswordResetToken;
import com.example.knowledge.models.Role;
import com.example.knowledge.models.User;
import com.example.knowledge.repositories.PasswordTokenRepository;
import com.example.knowledge.repositories.RoleRepository;
import com.example.knowledge.repositories.UserRepository;
import com.example.knowledge.services.mapper.UserMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataAccessException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;

import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordTokenRepository passwordTokenRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MessageSource messageSource;
    private final PasswordEncoder passwordEncoder;


    public void addRole(Long idUser, String roleName){
        String roleNameNew = roleName.trim();

        User user = userRepository.getUserById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + idUser + " does not exist"));

        if (roleNameNew.equals("USER")) {
            this.createRoleForUser(user.getIdUser(), 1);
        } else if (roleNameNew.equals("ADMIN")) {
            this.createRoleForUser(user.getIdUser(), 2);
        } else if (roleNameNew.equals("AUTHOR")) {
            this.createRoleForUser( user.getIdUser(), 3);
        }

    }

    public UserDto changeFirstNameandLastName(Long idUser, String firstName, String lastName){
        User user = userRepository.changeFirstName(idUser, firstName);
        User user2 = userRepository.changeLastName(idUser, lastName);
        UserMapper um = new UserMapper();
        return UserMapper.mapToUserDto(user2);
    }

    public List<User> getUsersNotAdmins(){
        return userRepository.getUsersNotAdmins();
    }

    public List<User> getAuthors(){
        return userRepository.getAuthors();
    }

    public void createRoleForUser(Integer userId, Integer roleId){
        try {
            Optional<User> user = getUserById(Long.valueOf(userId));
            if (user.isPresent()){
                User user2 = user.get();
                Optional<Role> role = roleRepository.findById(Math.toIntExact(roleId));
                if (role.isPresent()){
                    Role role2 = role.get();
                    user2.addRole(role2);
                    userRepository.save(user2);
                } else {
                    log.warn("Service: Role with ID {} not found", roleId);
                    throw new IllegalArgumentException("Role not found");
                }
            } else {
                log.warn("Service: User with ID {} not found", userId);
                throw new IllegalArgumentException("User not found");
            }

        } catch (Exception e){
            log.error("Service: Failed to create UserRole, id user: {}, id role: {}", userId, roleId);
            throw e;
        }
    }

    public void deleteRoleForUser(Long userId, Long roleId){
        try {
            Optional<User> user = getUserById(userId);
            if (user.isPresent()){
                User user2 = user.get();
                Optional<Role> role = roleRepository.findById(Math.toIntExact(roleId));
                if (role.isPresent()){
                    Role role2 = role.get();
                    user2.removeRole(role2);
                    userRepository.save(user2);
                } else {
                    log.warn("Service: Role with ID {} not found", roleId);
                    throw new IllegalArgumentException("Role not found");
                }
            } else {
                log.warn("Service: User with ID {} not found", userId);
                throw new IllegalArgumentException("User not found");
            }

        } catch (Exception e){
            log.error("Service: Failed to delete UserRole, id user: {}, id role: {}", userId, roleId);
            throw e;
        }
    }

    public Optional<User> getUserById(Long id){
        try {
            log.info("Service: Getting user by id: {}", id);
            return userRepository
                    .getUserById(id);
        } catch (EntityNotFoundException e){
            log.error("Service: Failed to find user with id: {}", id);
            throw e;
        }

    }

    public Optional<Long> getUserIdByEmail(String email){
        try {
            log.info("Service: Getting id user by email: {}", email);
            return userRepository
                    .getUserIdByEmail(email);
        } catch (EntityNotFoundException e){
            log.error("Service: Failed to find user id with email: {}", email);
            throw e;
        }

    }

    public Optional<User> getUserByEmail(String email){
        try {
            log.info("Service: Getting user by email: {}", email);
            return userRepository
                    .getUserByEmail(email);
        } catch (EntityNotFoundException e){
            log.error("Service: Failed to find user with email: {}", email);
            throw e;
        }

    }

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
