package com.streammovie.controller;

import com.streammovie.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/block/{id}")
    public ResponseEntity<Void> blockById(@PathVariable int id) {
        adminService.blockUserById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/block-by-email")
    public ResponseEntity<Void> blockByEmail(@RequestParam String email) {
        adminService.blockUserByEmail(email);
        return ResponseEntity.ok().build();
    }
}
