package org.launchcode.backend.repositories;

import org.launchcode.backend.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find all comments belonging to a specific movie
    List<Comment> findByMovieId(Long movieId);
}
