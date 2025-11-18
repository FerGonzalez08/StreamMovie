package com.streammovie.model;

import java.time.LocalDate;

public class Admin extends User {
    public Admin() { super(); }
    public Admin(int id, String email, LocalDate birthdate, String userName, String password, String role, String status) {
        super(id, email, birthdate, userName, password, role, status);
    }
}
