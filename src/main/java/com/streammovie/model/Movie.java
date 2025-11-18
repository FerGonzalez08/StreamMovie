package com.streammovie.model;

public class Movie {
    private int id;
    private String titulo;
    private String genero;
    private Integer anio;
    private String director;

    public Movie() {}

    public Movie(int id, String titulo, String genero, Integer anio, String director) {
        this.id = id;
        this.titulo = titulo;
        this.genero = genero;
        this.anio = anio;
        this.director = director;
    }

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
}
