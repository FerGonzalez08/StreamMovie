package com.streammovie.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

public class User {
    private int id;
    private String userName;
    private String email;
    @JsonIgnore
    private String password;
    private LocalDate birthdate;
    private String role;   // admin | client
    private String status; // ACTIVE | BLOCKED

    public User() {}

    public User(int id, String email, LocalDate birthdate, String userName, String password, String role, String status) {
        this.id = id;
        this.email = email;
        this.birthdate = birthdate;
        this.userName = userName;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDate getBirthdate() { return birthdate; }
    public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
