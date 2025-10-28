package org.launchcode.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int writing;
    private int direction;
    private int cinematography;
    private int acting;
    private int editing;
    private int sound;
    private int soundtrack;
    private int productionDesign;
    private int casting;
    private int effects;
    private double overall;

    @OneToOne
    @JoinColumn(name = "movie_id", nullable = false, unique = true)
    @JsonIgnoreProperties("rating")
    private Movie movie;

    // --- Getters & Setters ---
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

    // ✅ FIXED: no bidirectional recursion here
    public void setMovie(Movie movie) {
        this.movie = movie; // one-way link only
    }

    // --- Overall calculation ---
    public void calculateOverall() {
        this.overall = (writing + direction + cinematography + acting + editing +
                sound + soundtrack + productionDesign + casting + effects) / 10.0;
    }
}
