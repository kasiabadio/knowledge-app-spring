package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.models.Dto.PasswordDto;
import com.example.knowledge.models.User;
import com.example.knowledge.responses.GenericResponse;
import com.example.knowledge.services.AuthenticationService;
import com.example.knowledge.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;



@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class UserController {

    private final UserService userService;
    private final JavaMailSender mailSender;
    private final MessageSource messageSource;
    private final AuthenticationService authenticationService;

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) throws Exception {
        User user = userService.findUserByEmail(userEmail);
        if (user == null){
            throw new Exception("User not found");
        }
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        mailSender.send(userService.constructResetTokenEmail("http://locahost:8080/api", request.getLocale(), token, user));

        String message = messageSource.getMessage("message.resetPasswordEmail", null, request.getLocale());
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/changePassword")
    public ResponseEntity<String> showChangePassword(Locale locale, Model model, @RequestParam("token") String token){
        String result = authenticationService.validatePasswordResetToken(token);
        if (result != null){
            String message = messageSource.getMessage("auth.message." + result, null, locale);
            return new ResponseEntity<>("Authentication Failed: " + message, HttpStatus.UNAUTHORIZED);

        } else {
            model.addAttribute("token", token);
            return new ResponseEntity<>("Proceed to password change", HttpStatus.OK);
        }
    }

    @GetMapping("/savePassword")
    public ResponseEntity<String> savePassword(final Locale locale, @Valid PasswordDto passwordDto){
        String result = authenticationService.validatePasswordResetToken(passwordDto.getToken());

        if (result != null){
            String message = messageSource.getMessage("auth.message." + result, null, locale);
            return new ResponseEntity<>(message, HttpStatus.UNAUTHORIZED);
        }

        Optional user = userService.getUserByPasswordResetToken(passwordDto.getToken());

        if (user.isPresent()){
            userService.changeUserPassword((User) user.get(), passwordDto.getNewPassword());
            String successMessage = messageSource.getMessage("message.resetPasswordSuc", null, locale);
            return new ResponseEntity<>(successMessage, HttpStatus.OK);
        } else {
            String invalidMessage = messageSource.getMessage("auth.message.invalid", null, locale);
            return new ResponseEntity<>(invalidMessage, HttpStatus.BAD_REQUEST);
        }

    }


}
