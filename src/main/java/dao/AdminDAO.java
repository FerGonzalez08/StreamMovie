package dao;

import model.Admin; 
public class AdminDAO implements CRUD<Admin> 
{ 
    @Override 
    public void create(Admin admin) 
    { 
        // Similar a UserDAO 
    } 
    @Override 
    public Admin read(String userName) 
    { 
        // Código para leer admin 
    } 
    @Override 
    public void update(Admin admin) 
    { 
        // Código para actualizar admin 
    } 
    @Override 
    public void delete(String userName) 
    { 
        // Código para eliminar admin 
    } 
    public static void blockAccount(String email) 
    { 
        // Código para bloquear cuenta 
    } 
} 
