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
@CrossOrigin(origins = "http://localhost:5173")
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

    // POST a new movie (with optional rating)
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        // Set genre if provided
        if (movie.getGenre() != null && movie.getGenre().getId() != null) {
            genreRepository.findById(movie.getGenre().getId()).ifPresent(movie::setGenre);
        } else {
            movie.setGenre(null);
        }

        // Handle optional rating
        Rating rating = movie.getRating();
        if (rating != null) {
            rating.setMovie(movie);      // maintain bidirectional link
            rating.calculateOverall();   // calculate overall score
        }

        // Save movie (and rating if present)
        return movieRepository.save(movie);
    }

    // PUT to update a movie
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        return movieRepository.findById(id)
                .map(movie -> {
                    movie.setTitle(updatedMovie.getTitle());
                    movie.setYear(updatedMovie.getYear());
                    movie.setPosterUrl(updatedMovie.getPosterUrl());

                    if (updatedMovie.getGenre() != null && updatedMovie.getGenre().getId() != null) {
                        genreRepository.findById(updatedMovie.getGenre().getId())
                                .ifPresent(movie::setGenre);
                    } else {
                        movie.setGenre(null);
                    }

                    return ResponseEntity.ok(movieRepository.save(movie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE a movie and its rating
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(movie -> {
                    Rating rating = movie.getRating();
                    if (rating != null) {
                        ratingRepository.delete(rating);
                    }
                    movieRepository.delete(movie);
                    return ResponseEntity.<Void>noContent().build();
                })
                .orElse(ResponseEntity.<Void>notFound().build());
    }

    // POST a rating for a specific movie
    @PostMapping("/{movieId}/rating")
    public ResponseEntity<Rating> addRatingToMovie(@PathVariable Long movieId, @RequestBody Rating rating) {
        return movieRepository.findById(movieId)
                .map(movie -> {
                    rating.setMovie(movie);
                    rating.calculateOverall();
                    Rating saved = ratingRepository.save(rating);
                    movie.setRating(saved);
                    movieRepository.save(movie);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.<Rating>notFound().build());
    }

    // PUT (update) a rating for a specific movie
    @PutMapping("/{movieId}/rating")
    public ResponseEntity<Rating> updateRatingForMovie(@PathVariable Long movieId, @RequestBody Rating updatedRating) {
        return (ResponseEntity<Rating>) movieRepository.findById(movieId)
                .map(movie -> {
                    Rating existingRating = movie.getRating();
                    if (existingRating == null) {
                        return ResponseEntity.<Rating>notFound().build();
                    }

                    existingRating.setWriting(updatedRating.getWriting());
                    existingRating.setDirection(updatedRating.getDirection());
                    existingRating.setActing(updatedRating.getActing());
                    existingRating.setSound(updatedRating.getSound());
                    existingRating.setEffects(updatedRating.getEffects());
                    existingRating.setEditing(updatedRating.getEditing());
                    existingRating.setCinematography(updatedRating.getCinematography());
                    existingRating.setSoundtrack(updatedRating.getSoundtrack());
                    existingRating.setProductionDesign(updatedRating.getProductionDesign());
                    existingRating.setCasting(updatedRating.getCasting());
                    existingRating.calculateOverall();

                    return ResponseEntity.ok(ratingRepository.save(existingRating));
                })
                .orElse(ResponseEntity.<Rating>notFound().build());
    }

    // DELETE a rating for a specific movie
    @DeleteMapping("/{movieId}/rating")
    public ResponseEntity<Object> deleteRatingFromMovie(@PathVariable Long movieId) {
        return movieRepository.findById(movieId)
                .map(movie -> {
                    Rating rating = movie.getRating();
                    if (rating != null) {
                        movie.setRating(null);
                        ratingRepository.delete(rating);
                        movieRepository.save(movie);
                    }
                    return ResponseEntity.<Void>noContent().build();
                })
                .orElse(ResponseEntity.<Void>notFound().build());
    }
}