package com.streammovie.controller;

import com.streammovie.dao.UserDAO;
import com.streammovie.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserDAO userDao;

    public UserController(UserDAO userDao) {
        this.userDao = userDao;
    }

    @GetMapping
    public ResponseEntity<List<User>> all() {
        return ResponseEntity.ok(userDao.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> byId(@PathVariable int id) {
        return userDao.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        try {
            // Validaciones
            if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre de usuario es requerido");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El correo es requerido");
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es requerida");
            }

            // Verificar si el email ya existe
            if (userDao.getUserByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("El correo ya está registrado");
            }

            // Verificar si el username ya existe
            if (userDao.getUserByUserName(user.getUserName()).isPresent()) {
                return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso");
            }

            // Default role/status handling if missing
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                user.setRole("client");
            }
            if (user.getStatus() == null || user.getStatus().trim().isEmpty()) {
                user.setStatus("ACTIVE");
            }

            User created = userDao.createUser(user);
            return ResponseEntity.ok(created);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear usuario: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody User user) {
        try {
            // Verificar que el usuario existe
            if (!userDao.getUserById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // Validaciones
            if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre de usuario es requerido");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El correo es requerido");
            }

            user.setId(id);
            userDao.updateUser(user);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al actualizar usuario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            // Verificar que el usuario existe antes de eliminar
            if (!userDao.getUserById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }

            userDao.deleteUserById(id);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al eliminar usuario: " + e.getMessage());
        }
    }
}