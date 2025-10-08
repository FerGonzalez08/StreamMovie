package model;

import dao.MovieDAO;

public class Movie {
    private String nameMovie;
    private double sizeMovie;
    private int duration; // en minutos
    private String description;

    public Movie(String nameMovie, double sizeMovie, int duration, String description) {
        this.nameMovie = nameMovie;
        this.sizeMovie = sizeMovie;
        this.duration = duration;
        this.description = description;
    }

    // getters y setters

    public static Movie searchMovie(String nameMovie) {
        return MovieDAO.searchMovie(nameMovie);
    }
}