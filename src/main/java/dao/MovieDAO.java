package src.main.java.dao;

import model.Movie; 
public class MovieDAO implements CRUD<Movie> 
{ 
    @Override 
    public void create(Movie movie) 
    {
        // Insertar película 
    } 
    @Override 
    public Movie read(String nameMovie) 
    { 
        // Buscar película 
    } 
    @Override 
    public void update(Movie movie)
    { 
        // Actualizar película 
    } 
    @Override 
    public void delete(String nameMovie) 
    { 
        // Eliminar película 
    } 
    public static Movie searchMovie(String nameMovie) 
    { 
        // Método para búsqueda de películas 
    } 
} 