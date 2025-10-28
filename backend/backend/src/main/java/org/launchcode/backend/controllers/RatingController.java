package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Rating;
import org.launchcode.backend.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    // GET all ratings
    @GetMapping
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    // GET rating by ID
    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable Long id) {
        return ratingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT to update a rating
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
            ratingRepository.save(rating);
            return ResponseEntity.ok(rating);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE a rating
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        return ratingRepository.findById(id)
                .map(rating -> {
                    // detach from movie before deletion
                    if (rating.getMovie() != null) {
                        rating.getMovie().setRating(null);
                    }
                    ratingRepository.delete(rating);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
