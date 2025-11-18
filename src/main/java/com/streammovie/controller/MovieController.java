package com.streammovie.controller;

import com.streammovie.dao.MovieDAO;
import com.streammovie.model.Movie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    private final MovieDAO movieDao;

    public MovieController(MovieDAO movieDao) {
        this.movieDao = movieDao;
    }

    @GetMapping
    public ResponseEntity<List<Movie>> all() {
        return ResponseEntity.ok(movieDao.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> byId(@PathVariable int id) {
        return movieDao.getMovieById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Movie> create(@RequestBody Movie movie) {
        Movie created = movieDao.createMovie(movie);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Movie movie) {
        return movieDao.getMovieById(id).map(existing -> {
            movie.setId(id);
            movieDao.updateMovie(movie);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        movieDao.deleteMovieById(id);
        return ResponseEntity.noContent().build();
    }
}
