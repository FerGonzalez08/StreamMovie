package com.streammovie.controller;

import com.streammovie.dao.UserDAO;
import com.streammovie.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserDAO userDao;

    public AuthController(UserDAO userDao) {
        this.userDao = userDao;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String identifier = body.get("identifier");
        String password = body.get("password");
        if (identifier == null || password == null) {
            return ResponseEntity.badRequest().body("identifier and password required");
        }

        Optional<User> maybeUser = userDao.login(identifier, password);
        if (maybeUser.isPresent()) {
            // devuelve el usuario (sin password por @JsonIgnore)
            return ResponseEntity.ok(maybeUser.get());
        } else {
            return ResponseEntity.status(401).body("invalid credentials");
        }
    }
}
