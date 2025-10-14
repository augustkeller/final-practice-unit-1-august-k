package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Genre;
import org.launchcode.backend.repositories.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin(origins = "*")
public class GenreController {

    @Autowired
    private GenreRepository genreRepository;

    // GET all genres
    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    // GET genre by ID
    @GetMapping("/{id}")
    public ResponseEntity<Genre> getGenreById(@PathVariable Long id) {
        return genreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST a new genre
    @PostMapping
    public Genre createGenre(@RequestBody Genre genre) {
        return genreRepository.save(genre);
    }

    // PUT (update) an existing genre
    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id, @RequestBody Genre updatedGenre) {
        return genreRepository.findById(id)
                .map(genre -> {
                    genre.setName(updatedGenre.getName());
                    Genre saved = genreRepository.save(genre);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE a genre
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        return genreRepository.findById(id)
                .map(genre -> {
                    genreRepository.delete(genre);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
