package org.launchcode.backend.models;

import jakarta.persistence.*;

@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int writing;
    private int direction;
    private int acting;
    private int visuals;
    private int music;

    @OneToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    // Getters & setters
    public Long getId() { return id; }
    public int getWriting() { return writing; }
    public void setWriting(int writing) { this.writing = writing; }
    public int getDirection() { return direction; }
    public void setDirection(int direction) { this.direction = direction; }
    public int getActing() { return acting; }
    public void setActing(int acting) { this.acting = acting; }
    public int getVisuals() { return visuals; }
    public void setVisuals(int visuals) { this.visuals = visuals; }
    public int getMusic() { return music; }
    public void setMusic(int music) { this.music = music; }
}
