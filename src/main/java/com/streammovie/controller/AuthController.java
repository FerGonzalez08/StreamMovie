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
        try {
            String identifier = body.get("identifier");
            String password = body.get("password");

            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El identificador (email o usuario) es requerido");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es requerida");
            }

            Optional<User> maybeUser = userDao.login(identifier, password);

            if (maybeUser.isPresent()) {
                User user = maybeUser.get();

                // Verificar si el usuario está bloqueado
                if ("BLOCKED".equals(user.getStatus())) {
                    return ResponseEntity.status(403).body("Usuario bloqueado. Contacte al administrador");
                }

                // Devuelve el usuario (sin password por @JsonIgnore)
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Credenciales inválidas");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error en el servidor: " + e.getMessage());
        }
    }
}