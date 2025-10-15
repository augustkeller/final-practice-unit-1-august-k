package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Movie;
import org.launchcode.backend.models.Rating;
import org.launchcode.backend.models.Genre;
import org.launchcode.backend.repositories.MovieRepository;
import org.launchcode.backend.repositories.GenreRepository;
import org.launchcode.backend.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private RatingRepository ratingRepository;

    // GET all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // GET movie by ID
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST a new movie (genre optional)
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        // Ensure genre exists if provided
        if (movie.getGenre() != null && movie.getGenre().getId() != null) {
            genreRepository.findById(movie.getGenre().getId()).ifPresent(movie::setGenre);
        } else {
            movie.setGenre(null);
        }
        return movieRepository.save(movie);
    }

    // PUT to update a movie (including assigning a genre later)
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        return movieRepository.findById(id).map(movie -> {
            movie.setTitle(updatedMovie.getTitle());
            movie.setYear(updatedMovie.getYear());
            movie.setPosterUrl(updatedMovie.getPosterUrl());

            if (updatedMovie.getGenre() != null && updatedMovie.getGenre().getId() != null) {
                genreRepository.findById(updatedMovie.getGenre().getId())
                        .ifPresent(movie::setGenre);
            } else {
                movie.setGenre(null);
            }

            Movie saved = movieRepository.save(movie);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a movie and its rating
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(movie -> {
                    // Delete associated rating if it exists
                    Rating rating = movie.getRating();
                    if (rating != null) {
                        ratingRepository.delete(rating);
                    }
                    movieRepository.delete(movie);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // POST a rating for a specific movie
    @PostMapping("/{movieId}/rating")
    public ResponseEntity<Rating> addRatingToMovie(@PathVariable Long movieId, @RequestBody Rating rating) {
        return movieRepository.findById(movieId)
                .map(movie -> {
                    rating.setMovie(movie);
                    rating.calculateOverall();
                    Rating saved = ratingRepository.save(rating);
                    movie.setRating(saved); // maintain bidirectional link
                    movieRepository.save(movie);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
