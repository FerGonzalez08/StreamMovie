package model;

import dao.AdminDAO;

public class Admin extends User {

    public Admin(String email, String birthdate, String userName, String password) {
        super(email, birthdate, userName, password, "admin");
    }

    public void blockAccount(String email) {
        AdminDAO.blockAccount(email);
    }

    public void deleteAccount(String email) {
        AdminDAO.delete(email);
    }
}