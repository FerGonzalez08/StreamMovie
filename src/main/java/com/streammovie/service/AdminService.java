package com.streammovie.service;

import com.streammovie.dao.UserDAO;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserDAO userDao;
    public static final String STATUS_BLOCKED = "BLOCKED";

    public AdminService(UserDAO userDao) {
        this.userDao = userDao;
    }

    public void blockUserByEmail(String email) {
        userDao.updateStatusByEmail(email, STATUS_BLOCKED);
    }

    public void blockUserById(int id) {
        userDao.updateStatusById(id, STATUS_BLOCKED);
    }
}
