package org.launchcode.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Min(value = 1888, message = "Year must be realistic")
    @Max(value = 2100, message = "Year must be realistic")
    private int year;

    private String posterUrl;

    // --- Relationships ---

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @OneToOne(mappedBy = "movie", cascade = CascadeType.ALL)
    private Rating rating;

    // --- Constructors ---

    public Movie() {}

    public Movie(String title, Genre genre, int year, String posterUrl) {
        this.title = title;
        this.genre = genre;
        this.year = year;
        this.posterUrl = posterUrl;
    }

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
    public void setRating(Rating rating) { this.rating = rating; }
}
