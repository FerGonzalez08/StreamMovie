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
    public ResponseEntity<User> create(@RequestBody User user) {
        // Default role/status handling if missing
        if (user.getRole() == null) user.setRole("client");
        if (user.getStatus() == null) user.setStatus("ACTIVE");
        User created = userDao.createUser(user);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody User user) {
        return userDao.getUserById(id).map(existing -> {
            user.setId(id);
            userDao.updateUser(user);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        userDao.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
