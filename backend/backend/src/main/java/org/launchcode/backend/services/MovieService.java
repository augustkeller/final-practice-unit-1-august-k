package org.launchcode.backend.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.launchcode.backend.dto.MovieDTO;
import org.launchcode.backend.models.Movie;
import org.launchcode.backend.repositories.MovieRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final Client client;

    public MovieService(MovieRepository movieRepository, @Value("${GOOGLE_API_KEY}") String googleApiKey) {
        this.movieRepository = movieRepository;

        // ✅ Proper builder usage
        this.client = Client.builder()
                .apiKey(googleApiKey)
                .build();
    }

    public String generateDescription(String title) {
        try {
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-001",
                    "Write a short, engaging movie description for: " + title,
                    null
            );
            return response.text();
        } catch (Exception e) {
            return "Description unavailable.";
        }
    }

    public String generateBoxOffice(String title) {
        try {
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-001",
                    "How much did the movie " + title + " make at the box office?",
                    null
            );
            return response.text();
        } catch (Exception e) {
            return "Box office data unavailable.";
        }
    }

    public String generateAwards(String title) {
        try {
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-001",
                    "Which Oscars or Academy Awards did " + title + " win?",
                    null
            );
            return response.text();
        } catch (Exception e) {
            return "Awards information unavailable.";
        }
    }

    public Movie addMovie(MovieDTO dto) {
        String desc = generateDescription(dto.getTitle());
        String box = generateBoxOffice(dto.getTitle());
        String awards = generateAwards(dto.getTitle());

        Movie movie = new Movie(dto.getTitle(), dto.getGenreId(), dto.getYear(), dto.getPosterUrl());
        movie.setDescription(desc);
        movie.setBoxOffice(box);
        movie.setAwards(awards);

        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
}
