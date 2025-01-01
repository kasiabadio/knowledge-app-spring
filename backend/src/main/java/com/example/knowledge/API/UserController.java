package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.models.Dto.PasswordDto;
import com.example.knowledge.models.Dto.UserDto;
import com.example.knowledge.models.User;
import com.example.knowledge.services.AuthenticationService;
import com.example.knowledge.services.UserService;
import com.example.knowledge.services.mapper.UserMapper;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class UserController {

    private final UserService userService;
    private final JavaMailSender mailSender;
    private final MessageSource messageSource;
    private final AuthenticationService authenticationService;


    @PutMapping("/changeNameAndSurname/{firstName}/{lastName}")
    private ResponseEntity<UserDto> changeFirstNameandLastName(
            @PathVariable Long idUser,
            @PathVariable String firstName,
            @PathVariable String lastName){
        if (StringUtils.isEmpty(firstName) || StringUtils.isEmpty(lastName)){
            log.error("Controller: First name is empty or last name is empty");
            return null;
        }
        return ResponseEntity.status(HttpStatus.OK).body(userService.changeFirstNameandLastName(idUser, firstName, lastName));
    }

    @GetMapping("/all")
    private ResponseEntity<List<User>> getUsersNotAdmins(){
        List<User> users = userService.getUsersNotAdmins();
        if (!users.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(users);
        } else {
            return null;
        }
    }

    @GetMapping("/allAuthors")
    private ResponseEntity<List<UserDto>> getAuthors(){
        List<User> authors = userService.getAuthors();
        if (!authors.isEmpty()) {
            List<UserDto> authorDtos = UserMapper.mapToUserDtoList(authors);
            return ResponseEntity.status(HttpStatus.OK).body(authorDtos);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("getUserIdByEmail/{email}")
    private ResponseEntity<Optional<Long>> getUserIdByEmail(@PathVariable String email){

        if (!StringUtils.isEmpty(email)){
            log.info("Controller: Getting id user by email: {}", email);
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserIdByEmail(email));
        } else {
            log.error("Controller: no email provided");
        }
        return null;
    }

    @GetMapping("getUserByEmail/{email}")
    private ResponseEntity<Optional<User>> getUserByEmail(@PathVariable String email){
        if (!StringUtils.isEmpty(email)){
            log.info("Controller: Getting user by email: {}", email);
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserByEmail(email));
        } else {
            log.error("Controller: no email provided");
        }
        return null;
    }

    private ResponseEntity<Map<String, String>> createResponse(HttpStatus status, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        try {
            User user = userService.findUserByEmail(userEmail);
            if (user == null) {
                return createResponse(HttpStatus.NOT_FOUND, "User not found");
            }
            String token = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user, token);
            mailSender.send(userService.constructResetTokenEmail("http://localhost:8080/api", request.getLocale(), token, user));

            return createResponse(HttpStatus.OK, "Reset Password");
        } catch (EntityNotFoundException e) {
            return createResponse(HttpStatus.NOT_FOUND, "User not found with email: " + userEmail);
        } catch (MailException e) {
            return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending email. Please try again later.");
        } catch (Exception e) {
            return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
        }
    }

    @GetMapping("/changePassword")
    public ResponseEntity<Map<String, String>> showChangePassword(Locale locale, Model model, @RequestParam("token") String token) {
        String result = authenticationService.validatePasswordResetToken(token);
        if (result != null) {
            return createResponse(HttpStatus.UNAUTHORIZED, "Authentication Failed");
        } else {
            model.addAttribute("token", token);
            return createResponse(HttpStatus.OK, "Proceed to password change");
        }
    }

    @PostMapping("/savePassword")
    public ResponseEntity<Map<String, String>> savePassword(@RequestBody @Valid PasswordDto passwordDto) {

        try {
            String result = authenticationService.validatePasswordResetToken(passwordDto.getToken());
            if (result != null) {
                return createResponse(HttpStatus.UNAUTHORIZED, "Unauthorized: " + result);
            }

            Optional<User> user = userService.getUserByPasswordResetToken(passwordDto.getToken());
            if (user.isPresent()) {
                userService.changeUserPassword(user.get(), passwordDto.getNewPassword());
                return createResponse(HttpStatus.OK, "Reset password success");
            } else {
                return createResponse(HttpStatus.BAD_REQUEST, "User not found");
            }
        } catch (EntityNotFoundException e) {
            return createResponse(HttpStatus.BAD_REQUEST, "Invalid token or user not found");
        } catch (Exception e) {
            return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
        }
    }

}
