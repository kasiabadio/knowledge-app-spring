package com.example.knowledge.API;

import com.example.knowledge.CorsConfiguration;
import com.example.knowledge.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = { CorsConfiguration.LOCALHOST_ORIGIN })
public class RoleController {

    private final UserService us;

    @Autowired
    public RoleController(UserService us){
        this.us = us;
    }

    @PostMapping("/addRole/{userId}/{roleId}")
    public ResponseEntity<?> createRoleForUser(@PathVariable Long userId,
                                               @PathVariable Long roleId){
        log.info("Trying adding role: id user: {}, id role: {}", userId, roleId);
        try {
            us.createRoleForUser(Math.toIntExact(userId), Math.toIntExact(roleId));
            log.info("Controller: Adding new UserRole entry: id user: {} id role: {}", userId, roleId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e){
            log.error("Controller exception of creating new UserRole, id user: {}, id role: {}", userId, roleId);
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @DeleteMapping("/deleteRole/{userId}/{roleId}")
    public ResponseEntity<?> deleteRoleForUser(@PathVariable Long userId,
                                               @PathVariable Long roleId){
        log.info("Trying deleting role: id user: {}, id role: {}", userId, roleId);
        try {
            us.deleteRoleForUser(userId, roleId);
            log.info("Controller: Deleting new UserRole entry: id user: {} id role: {}", userId, roleId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e){
            log.error("Controller exception of deleting new UserRole, id user: {}, id role: {}", userId, roleId);
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
}
