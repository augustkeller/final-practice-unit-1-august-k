package org.launchcode.backend.dto;

import jakarta.validation.constraints.*;

public class MovieDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Genre ID is required")
    private Long genreId;

    @Min(value = 1888, message = "Year must be realistic")
    @Max(value = 2100, message = "Year must be realistic")
    private int year;

    private String posterUrl;

    // ✅ Optional flag to control AI generation
    private boolean generateAiData = false;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getGenreId() { return genreId; }
    public void setGenreId(Long genreId) { this.genreId = genreId; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public boolean isGenerateAiData() { return generateAiData; }
    public void setGenerateAiData(boolean generateAiData) { this.generateAiData = generateAiData; }
}
