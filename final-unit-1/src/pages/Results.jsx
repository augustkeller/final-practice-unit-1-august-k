import { useLocation } from "react-router-dom";
import { useState } from "react";

function Results() {
    const location = useLocation();
    const { movies: initialMovies, categories } = location.state || { movies: [], categories: [] }; // pull out movies and categories from location.state. rename the movies variable to initialMovies.

    const [movies, setMovies] = useState(initialMovies);

    function handleDelete(indexToRemove) {
        setMovies(prevMovies => prevMovies.filter((_, i) => i !== indexToRemove));
    } // remove movie from the list based on its index in the array. _ is a placeholder for the item itself (not used). i is the index of each movie.

    function getCategoryScores(movie) {
        if (categories.length === 0 || categories.includes("Overall")) {
            return `Overall Score: ${movie.rating?.overall || 'N/A'}`;
        } // checks if no categories or overall category was selected.

        // Map display names to backend field names
        const categoryMap = {
            "Writing": "writing",
            "Direction": "direction",
            "Cinematography": "cinematography",
            "Acting": "acting",
            "Editing": "editing",
            "Sound": "sound",
            "Score/Soundtrack": "soundtrack",
            "Production Design": "productionDesign",
            "Casting": "casting",
            "Effects": "effects"
        };

        return categories
            .map(cat => {
                const fieldName = categoryMap[cat];
                const score = movie.rating?.[fieldName] || 'N/A';
                return `${cat}: ${score}`;
            })
            .join(", "); // maps the selected categories and their accompanying scores.
    }

    return (
        <div className="results">
            <h1>Personalized Recommendations</h1>

            {movies.length === 0 ? (
                <p>No movie recommendations left. Please adjust your preferences.</p> // catch if results return no movies.
            ) : (
                <ol>
                    {movies.slice(0, 5).map((movie, index) => (
                        <li key={index}>
                            {movie.title} ({movie.genre?.name || 'Unknown'}, {movie.year}) — {getCategoryScores(movie)}
                            <br />
                            <img 
                                src={movie.posterUrl}
                                alt={`Poster for ${movie.title}`}
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
