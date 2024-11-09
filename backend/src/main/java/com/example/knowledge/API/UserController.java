package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.models.Dto.PasswordDto;
import com.example.knowledge.models.User;
import com.example.knowledge.services.AuthenticationService;
import com.example.knowledge.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class UserController {

    private final UserService userService;
    private final JavaMailSender mailSender;
    private final MessageSource messageSource;
    private final AuthenticationService authenticationService;

    // Return a consistent JSON structure for all responses
    private ResponseEntity<Map<String, String>> createResponse(HttpStatus status, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        if (user == null) {
            return createResponse(HttpStatus.NOT_FOUND, "User not found");
        }
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        mailSender.send(userService.constructResetTokenEmail("http://localhost:8080/api", request.getLocale(), token, user));

        return createResponse(HttpStatus.OK, "Reset Password");
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
    }

}
