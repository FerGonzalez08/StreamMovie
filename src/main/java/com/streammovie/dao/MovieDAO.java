package com.streammovie.dao;

import com.streammovie.model.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class MovieDAO {

    private final JdbcTemplate jdbc;

    public MovieDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Movie createMovie(Movie movie) {
        String sql = "INSERT INTO Peliculas (titulo, genero, anio, director) VALUES (?, ?, ?, ?)";
        jdbc.update(sql, movie.getTitulo(), movie.getGenero(), movie.getAnio(), movie.getDirector());
        Integer id = jdbc.queryForObject("SELECT CAST(SCOPE_IDENTITY() AS int)", Integer.class);
        if (id != null) movie.setId(id);
        return movie;
    }

    public Optional<Movie> getMovieById(int id) {
        String sql = "SELECT id, titulo, genero, anio, director FROM Peliculas WHERE id = ?";
        List<Movie> list = jdbc.query(sql, new Object[]{id}, new MovieRowMapper());
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Movie> getMoviesByTitle(String title) {
        String sql = "SELECT id, titulo, genero, anio, director FROM Peliculas WHERE titulo LIKE ?";
        return jdbc.query(sql, new Object[]{"%" + title + "%"}, new MovieRowMapper());
    }

    public List<Movie> getAllMovies() {
        String sql = "SELECT id, titulo, genero, anio, director FROM Peliculas";
        return jdbc.query(sql, new MovieRowMapper());
    }

    public void updateMovie(Movie movie) {
        String sql = "UPDATE Peliculas SET titulo = ?, genero = ?, anio = ?, director = ? WHERE id = ?";
        jdbc.update(sql, movie.getTitulo(), movie.getGenero(), movie.getAnio(), movie.getDirector(), movie.getId());
    }

    public void deleteMovieById(int id) {
        String sql = "DELETE FROM Peliculas WHERE id = ?";
        jdbc.update(sql, id);
    }

    private static class MovieRowMapper implements RowMapper<Movie> {
        @Override
        public Movie mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Movie(
                    rs.getInt("id"),
                    rs.getString("titulo"),
                    rs.getString("genero"),
                    rs.getObject("anio") == null ? null : rs.getInt("anio"),
                    rs.getString("director")
            );
        }
    }
}
