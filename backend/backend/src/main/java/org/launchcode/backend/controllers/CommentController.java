package org.launchcode.backend.controllers;

import org.launchcode.backend.models.Comment;
import org.launchcode.backend.repositories.CommentRepository;
import org.launchcode.backend.repositories.MovieRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final MovieRepository movieRepository;

    public CommentController(CommentRepository commentRepository, MovieRepository movieRepository) {
        this.commentRepository = commentRepository;
        this.movieRepository = movieRepository;
    }

    //Create a comment for a movie
    @PostMapping("/movie/{movieId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long movieId, @RequestBody Comment comment) {
        return movieRepository.findById(movieId).map(movie -> {
            comment.setMovie(movie);
            Comment saved = commentRepository.save(comment);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    //Get all comments for a movie
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Comment>> getCommentsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(commentRepository.findByMovieId(movieId));
    }

    //Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        return commentRepository.findById(id)
                .map(comment -> {
                    commentRepository.delete(comment);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
