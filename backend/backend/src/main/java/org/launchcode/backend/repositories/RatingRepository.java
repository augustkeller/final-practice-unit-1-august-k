package org.launchcode.backend.repositories;

import org.launchcode.backend.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {}
