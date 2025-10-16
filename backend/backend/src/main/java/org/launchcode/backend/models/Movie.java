package org.launchcode.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int year;
    private String posterUrl;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    @JsonIgnoreProperties("movies") // prevent infinite loop
    private Genre genre;

    @OneToOne(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("movie")
    private Rating rating;

    // --- Getters and Setters ---
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public Genre getGenre() { return genre; }
    public void setGenre(Genre genre) { this.genre = genre; }

    public Rating getRating() { return rating; }

    // ✅ Safe and non-recursive version
    public void setRating(Rating rating) {
        this.rating = rating;
        if (rating != null && rating.getMovie() != this) {
            rating.setMovie(this); // maintain one-directional link only
        }
    }
}
