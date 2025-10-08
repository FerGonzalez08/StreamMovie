package model;

import dao.UserDAO;

public class User {
    protected String email;
    protected String birthdate;
    protected String userName;
    protected String password;
    protected String role;

    public User(String email, String birthdate, String userName, String password, String role) {
        this.email = email;
        this.birthdate = birthdate;
        this.userName = userName;
        this.password = password;
        this.role = role;
    }

    // Getters y setters (omito para brevedad)

    public boolean login() {
        return UserDAO.login(this.userName, this.password);
    }
}
