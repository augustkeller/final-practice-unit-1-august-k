import { useLocation } from "react-router-dom";
import { useState } from "react";

function Results() {
    const location = useLocation();
    const { movies: initialMovies, categories } = location.state || { movies: [], categories: [] }; // pull out movies and categories from location.state. rename the movies variable to initialMovies.

    const [movies, setMovies] = useState(initialMovies);

    function handleDelete(indexToRemove) {
        setMovies(prevMovies => prevMovies.filter((_, i) => i !== indexToRemove));
    } //remove movie from the list based on its index in the array. _ is a placeholder for the item itself (not used). i is the index of each movie.

    function getCategoryScores(movie) {
        if (categories.length === 0 || categories.includes("Overall")) {
            return `Overall Score: ${movie.Average}`;
        } //checks if no categories or overall category was selected.

        return categories.map(cat => `${cat}: ${movie[cat]}`).join(", "); //maps the selected categories and their accompanying scores.
    }

    return (
        <div className="results">
            <h1>Personalized Recommendations</h1>

            {movies.length === 0 ? (
                <p>No movie recommendations left. Please adjust your preferences.</p> //catch if results return no movies.
            ) : (
                <ol>
                    {movies.slice(0, 5).map((movie, index) => (
                        <li key={index}>
                            {movie.Title} ({movie.Genre}, {movie.Year}) — {getCategoryScores(movie)}
                            <br />
                            <img 
                                src={movie.Poster}
                                alt={`Poster for ${movie.Title}`}
                            />
                            <br />
                            <button onClick={() => handleDelete(index)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

export default Results;
