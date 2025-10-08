package src.main.java.dao;

import model.User; 
import database.DatabaseConnection; 

import java.sql.Connection; 
import java.sql.PreparedStatement; 
import java.sql.ResultSet; 
import java.sql.SQLException; 

public class UserDAO implements CRUD<User> 
{ 
    @Override 
    public void create(User user) 
    { 
        String sql = "INSERT INTO Users (email, birthdate, userName, password, role) VALUES (?, ?, ?, ?, ?)"; 
        try (Connection conn = DatabaseConnection.getConnection(); 

        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            stmt.setString(1, user.getEmail()); 
            stmt.setString(2, user.getBirthdate()); 
            stmt.setString(3, user.getUserName()); 
            stmt.setString(4, user.getPassword()); 
            stmt.setString(5, user.getRole()); 
            stmt.executeUpdate(); 

        } 
        catch (SQLException e) 
        { 
            e.printStackTrace(); 
        } 

    } 

    @Override 

    public User read(String userName) 
    { 
        String sql = "SELECT * FROM Users WHERE userName = ?"; 
        User user = null; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql))
        { 

            stmt.setString(1, userName); 
            ResultSet rs = stmt.executeQuery(); 
            if (rs.next()) 
            { 
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
        return user; 
    } 


    @Override 

    public void update(User user) 
    { 
        String sql = "UPDATE Users SET email = ?, birthdate = ?, password = ?, role = ? WHERE userName = ?"; 
        try (Connection conn = DatabaseConnection.getConnection(); 
        PreparedStatement stmt = conn.prepareStatement(sql)) 
        { 
            stmt.setString(1, user.getEmail()); 
            stmt.setString(2, user.getBirthdate()); 
            stmt.setString(3, user.getPassword()); 
            stmt.setString(4, user.getRole()); 
            stmt.setString(5, user.getUserName()); 
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