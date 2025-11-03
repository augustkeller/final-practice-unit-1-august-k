package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Genre;
import org.launchcode.backend.models.Movie;
import org.launchcode.backend.repositories.GenreRepository;
import org.launchcode.backend.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Genre> getGenreById(@PathVariable Long id) {
        return genreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Genre createGenre(@RequestBody Genre genre) {
        return genreRepository.save(genre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id, @RequestBody Genre updatedGenre) {
        return genreRepository.findById(id)
                .map(genre -> {
                    genre.setName(updatedGenre.getName());
                    return ResponseEntity.ok(genreRepository.save(genre));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGenre(@PathVariable Long id) {
        return genreRepository.findById(id)
                .map(genre -> {
                    // Detach genre from all linked movies first
                    if (genre.getMovies() != null) {
                        genre.getMovies().forEach(movie -> movie.setGenre(null));
                    }
                    genreRepository.delete(genre);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{genreId}/movies")
    public ResponseEntity<Void> assignMoviesToGenre(
            @PathVariable Long genreId,
            @RequestBody List<Long> movieIds) {

        Genre genre = genreRepository.findById(genreId).orElse(null);
        if (genre == null) {
            return ResponseEntity.notFound().build();
        }

        List<Movie> movies = movieRepository.findAllById(movieIds);
        for (Movie movie : movies) {
            movie.setGenre(genre);
        }
        movieRepository.saveAll(movies);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{genreId}/movies/remove")
    public ResponseEntity<Void> removeMoviesFromGenre(
            @PathVariable Long genreId,
            @RequestBody List<Long> movieIds) {

        Genre genre = genreRepository.findById(genreId).orElse(null);
        if (genre == null) {
            return ResponseEntity.notFound().build();
        }

        List<Movie> movies = movieRepository.findAllById(movieIds);
        for (Movie movie : movies) {
            if (genre.equals(movie.getGenre())) {
                movie.setGenre(null); // detach from genre
            }
        }
        movieRepository.saveAll(movies);

        return ResponseEntity.noContent().build();
    }
}
