package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Movie;
import org.launchcode.backend.models.Rating;
import org.launchcode.backend.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @GetMapping
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable Long id) {
        return ratingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Rating addRating(@RequestBody Rating rating) {
        rating.calculateOverall();
        return ratingRepository.save(rating);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable Long id, @RequestBody Rating updatedRating) {
        return ratingRepository.findById(id).map(rating -> {
            rating.setWriting(updatedRating.getWriting());
            rating.setDirection(updatedRating.getDirection());
            rating.setCinematography(updatedRating.getCinematography());
            rating.setActing(updatedRating.getActing());
            rating.setEditing(updatedRating.getEditing());
            rating.setSound(updatedRating.getSound());
            rating.setSoundtrack(updatedRating.getSoundtrack());
            rating.setProductionDesign(updatedRating.getProductionDesign());
            rating.setCasting(updatedRating.getCasting());
            rating.setEffects(updatedRating.getEffects());
            rating.calculateOverall();

            if (updatedRating.getMovie() != null) {
                rating.setMovie(updatedRating.getMovie());
            }

            ratingRepository.save(rating);
            return ResponseEntity.ok(rating);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        return ratingRepository.findById(id)
                .map(rating -> {
                    Movie movie = rating.getMovie();
                    if (movie != null) {
                        movie.setRating(null); // detach
                    }
                    ratingRepository.delete(rating);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
