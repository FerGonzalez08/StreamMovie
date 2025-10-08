package dao;

import model.Client; 
public class ClientDAO implements CRUD<Client> 
{ 
    @Override 
    public void create(Client client)
    { 
        // Similar a UserDAO con tabla Clients (o puede ser la misma tabla con rol client) 
    } 
    @Override 

    public Client read(String userName) 
    { 
        // Código para leer cliente 
    } 
    @Override 

    public void update(Client client) 
    { 
        // Código para actualizar cliente 
    } 
    @Override 

    public void delete(String userName) 
    { 
        // Código para eliminar cliente 
    } 
    // Métodos adicionales si es necesario 
} 