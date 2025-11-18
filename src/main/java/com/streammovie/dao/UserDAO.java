package com.streammovie.dao;

import com.streammovie.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDAO {

    private final JdbcTemplate jdbc;

    public UserDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // CREATE
    public User createUser(User user) {
        String sql = "INSERT INTO Usuarios (nombre, correo, contrasena, birthdate, role, status) VALUES (?, ?, ?, ?, ?, ?)";
        jdbc.update(sql,
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                user.getBirthdate() == null ? null : Date.valueOf(user.getBirthdate()),
                user.getRole(),
                user.getStatus() == null ? "ACTIVE" : user.getStatus()
        );
        // Obtener id generado (SQL Server: SCOPE_IDENTITY)
        Integer id = jdbc.queryForObject("SELECT CAST(SCOPE_IDENTITY() AS int)", Integer.class);
        if (id != null) user.setId(id);
        return user;
    }

    // READ por id
    public Optional<User> getUserById(int id) {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios WHERE id = ?";
        List<User> result = jdbc.query(sql, new Object[]{id}, new UserRowMapper());
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    // READ por userName
    public Optional<User> getUserByUserName(String userName) {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios WHERE nombre = ?";
        List<User> result = jdbc.query(sql, new Object[]{userName}, new UserRowMapper());
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    // READ por email
    public Optional<User> getUserByEmail(String email) {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios WHERE correo = ?";
        List<User> result = jdbc.query(sql, new Object[]{email}, new UserRowMapper());
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    // UPDATE (por id)
    public void updateUser(User user) {
        String sql = "UPDATE Usuarios SET nombre = ?, correo = ?, contrasena = ?, birthdate = ?, role = ?, status = ? WHERE id = ?";
        jdbc.update(sql,
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                user.getBirthdate() == null ? null : Date.valueOf(user.getBirthdate()),
                user.getRole(),
                user.getStatus(),
                user.getId()
        );
    }

    // DELETE por id
    public void deleteUserById(int id) {
        String sql = "DELETE FROM Usuarios WHERE id = ?";
        jdbc.update(sql, id);
    }

    public List<User> getAllUsers() {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios";
        return jdbc.query(sql, new UserRowMapper());
    }

    public List<User> findByRole(String role) {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios WHERE role = ?";
        return jdbc.query(sql, new Object[]{role}, new UserRowMapper());
    }

    // Login simple: devuelve Optional<User> si coincide la contraseña
    public Optional<User> login(String identifier, String password) {
        String sql = "SELECT id, nombre, correo, contrasena, birthdate, role, status FROM Usuarios WHERE correo = ? OR nombre = ?";
        List<User> result = jdbc.query(sql, new Object[]{identifier, identifier}, new UserRowMapper());
        if (result.isEmpty()) return Optional.empty();
        User u = result.get(0);
        if (u.getPassword() != null && u.getPassword().equals(password)) {
            return Optional.of(u);
        }
        return Optional.empty();
    }

    public void updateStatusById(int userId, String status) {
        String sql = "UPDATE Usuarios SET status = ? WHERE id = ?";
        jdbc.update(sql, status, userId);
    }

    public void updateStatusByEmail(String email, String status) {
        String sql = "UPDATE Usuarios SET status = ? WHERE correo = ?";
        jdbc.update(sql, status, email);
    }

    // RowMapper
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            int id = rs.getInt("id");
            String nombre = rs.getString("nombre");
            String correo = rs.getString("correo");
            String contrasena = rs.getString("contrasena");
            Date birth = rs.getDate("birthdate");
            LocalDate birthdate = birth == null ? null : birth.toLocalDate();
            String role = rs.getString("role");
            String status = rs.getString("status");
            return new User(id, correo, birthdate, nombre, contrasena, role, status);
        }
    }
}
