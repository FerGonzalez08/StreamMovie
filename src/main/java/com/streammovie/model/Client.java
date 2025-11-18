package com.streammovie.model;

import java.time.LocalDate;

public class Client extends User {
    public Client() { super(); }
    public Client(int id, String email, LocalDate birthdate, String userName, String password, String role, String status) {
        super(id, email, birthdate, userName, password, role, status);
    }
}
