package org.launchcode.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(0) @Max(10)
    private int writing;

    @Min(0) @Max(10)
    private int direction;

    @Min(0) @Max(10)
    private int cinematography;

    @Min(0) @Max(10)
    private int acting;

    @Min(0) @Max(10)
    private int editing;

    @Min(0) @Max(10)
    private int sound;

    @Min(0) @Max(10)
    private int soundtrack;

    @Min(0) @Max(10)
    private int productionDesign;

    @Min(0) @Max(10)
    private int casting;

    @Min(0) @Max(10)
    private int effects;

    private double overall; // Calculated automatically

    @OneToOne
    @JoinColumn(name = "movie_id")
    @JsonBackReference
    private Movie movie;

    // Constructors
    public Rating() {}

    public Rating(int writing, int direction, int cinematography, int acting,
                  int editing, int sound, int soundtrack, int productionDesign,
                  int casting, int effects, Movie movie) {
        this.writing = writing;
        this.direction = direction;
        this.cinematography = cinematography;
        this.acting = acting;
        this.editing = editing;
        this.sound = sound;
        this.soundtrack = soundtrack;
        this.productionDesign = productionDesign;
        this.casting = casting;
        this.effects = effects;
        this.movie = movie;
        calculateOverall();
    }

    // Getters and setters
    public Long getId() { return id; }
    public int getWriting() { return writing; }
    public void setWriting(int writing) { this.writing = writing; calculateOverall(); }

    public int getDirection() { return direction; }
    public void setDirection(int direction) { this.direction = direction; calculateOverall(); }

    public int getCinematography() { return cinematography; }
    public void setCinematography(int cinematography) { this.cinematography = cinematography; calculateOverall(); }

    public int getActing() { return acting; }
    public void setActing(int acting) { this.acting = acting; calculateOverall(); }

    public int getEditing() { return editing; }
    public void setEditing(int editing) { this.editing = editing; calculateOverall(); }

    public int getSound() { return sound; }
    public void setSound(int sound) { this.sound = sound; calculateOverall(); }

    public int getSoundtrack() { return soundtrack; }
    public void setSoundtrack(int soundtrack) { this.soundtrack = soundtrack; calculateOverall(); }

    public int getProductionDesign() { return productionDesign; }
    public void setProductionDesign(int productionDesign) { this.productionDesign = productionDesign; calculateOverall(); }

    public int getCasting() { return casting; }
    public void setCasting(int casting) { this.casting = casting; calculateOverall(); }

    public int getEffects() { return effects; }
    public void setEffects(int effects) { this.effects = effects; calculateOverall(); }

    public double getOverall() { return overall; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    // Helper method to calculate overall average
    private void calculateOverall() {
        this.overall = (writing + direction + cinematography + acting + editing +
                sound + soundtrack + productionDesign + casting + effects) / 10.0;
    }
}
