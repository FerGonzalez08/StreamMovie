package src.main.java.dao;

import model.User; 
import database.DatabaseConnection; 

import java.sql.Connection; 
import java.sql.PreparedStatement; 
import java.sql.ResultSet; 
import java.sql.SQLException; 
// Clase DAO para operaciones CRUD sobre la tabla Users.
// Contiene métodos para crear, leer, actualizar, borrar usuarios
// y un método estático de login. Usa PreparedStatement para evitar
// inyección SQL y try-with-resources para cerrar conexiones automáticamente.

public class UserDAO implements CRUD<User> 
{ 
    @Override 
    public void create(User user) 
    { 
        // Inserta un nuevo registro en la tabla Users.
        String sql = "INSERT INTO Users (email, birthdate, userName, password, role) VALUES (?, ?, ?, ?, ?)"; 
        try (Connection conn = DatabaseConnection.getConnection(); 

        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            // Asigna los parámetros del PreparedStatement con datos del objeto User.
            stmt.setString(1, user.getEmail()); 
            stmt.setString(2, user.getBirthdate()); 
            stmt.setString(3, user.getUserName()); 
            stmt.setString(4, user.getPassword()); 
            stmt.setString(5, user.getRole()); 
            // Ejecuta la inserción.
            stmt.executeUpdate(); 
        } 
        catch (SQLException e) 
        { 
            // En caso de error SQL imprime la traza (se puede mejorar con logging).
            e.printStackTrace(); 
        } 
    } 

    @Override 

    public User read(String userName) 
    { 
        // Lee un usuario por su userName (clave de búsqueda).
        String sql = "SELECT * FROM Users WHERE userName = ?"; 
        User user = null; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql))
        { 
            // Asigna el userName al parámetro y ejecuta la consulta.
            stmt.setString(1, userName); 
            ResultSet rs = stmt.executeQuery(); 
            if (rs.next()) 
            { 
                // Construye un objeto User a partir del ResultSet.
                user = new User( 
                        rs.getString("email"), 
                        rs.getString("birthdate"), 
                        rs.getString("userName"), 
                        rs.getString("password"), 
                        rs.getString("role") 
                ); 
            } 
        } 
        catch (SQLException e) 
        { 
            e.printStackTrace(); 
        } 
        // Devuelve el usuario encontrado o null si no existe.
        return user; 
    } 


    @Override 

    public void update(User user) 
    { 
        // Actualiza los campos (excepto userName) para el usuario dado.
        String sql = "UPDATE Users SET email = ?, birthdate = ?, password = ?, role = ? WHERE userName = ?"; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            stmt.setString(1, user.getEmail()); 
            stmt.setString(2, user.getBirthdate()); 
            stmt.setString(3, user.getPassword()); 
            stmt.setString(4, user.getRole()); 
            stmt.setString(5, user.getUserName()); 
            // Ejecuta la actualización.
            stmt.executeUpdate(); 
        } 
        catch (SQLException e) 
        { 
            e.printStackTrace(); 
        } 
    } 

    @Override 

    public void delete(String userName) 
    { 
        // Elimina el usuario identificado por userName.
        String sql = "DELETE FROM Users WHERE userName = ?"; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            stmt.setString(1, userName); 
            stmt.executeUpdate(); 
        } 
        catch (SQLException e) 
        { 
            e.printStackTrace(); 
        } 
    } 

  

    public static boolean login(String userName, String password) 
    { 
        // Verifica credenciales comprobando si existe un registro con userName y password.
        // Retorna true si hay al menos 1 coincidencia.
        String sql = "SELECT COUNT(*) FROM Users WHERE userName = ? AND password = ?"; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            stmt.setString(1, userName); 
            stmt.setString(2, password); 
            ResultSet rs = stmt.executeQuery(); 
            if (rs.next()) 
            { 
                return rs.getInt(1) > 0; 
            } 
        }
        catch (SQLException e) 
        { 
            e.printStackTrace(); 
        } 
        return false; 
    } 
}