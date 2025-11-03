import { useState, useEffect } from 'react';
import { useAllMovies } from "./AllMovies";
import '../App.css';

function RandomMovieGenerator() {
    const { movies: allMovies, loading, error } = useAllMovies();
    const [randomMovie, setRandomMovie] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false); // track AI generation

    function getRandomMovie() {
        if (!allMovies || allMovies.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        return allMovies[randomIndex];
    }

    function handleClick() {
        setRandomMovie(getRandomMovie());
    }

    async function handleGenerateAI() {
        if (!randomMovie) return;
        try {
            setLoadingAI(true);
            const res = await fetch(`http://localhost:8080/api/movies/ai/${randomMovie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const updatedMovie = await res.json();
                setRandomMovie(updatedMovie); // update with AI data
            } else {
                alert(`Failed to generate AI content for "${randomMovie.title}"`);
            }
        } catch (err) {
            console.error("Error generating AI content:", err);
            alert("Error generating AI content. Check console for details.");
        } finally {
            setLoadingAI(false);
        }
    }

    // Set initial random movie once movies are loaded
    useEffect(() => {
        if (allMovies && allMovies.length > 0) {
            setRandomMovie(getRandomMovie());
        }
    }, [allMovies]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!allMovies || allMovies.length === 0) return <div>No movies available</div>;
    if (!randomMovie) return <div>No movies available</div>;

    return (
        <div className='random-recommendation'>
            <h2>Random Recommendation:</h2>
            <p>
                <strong>Title:</strong> {randomMovie.title}<br />
                <strong>Year:</strong> {randomMovie.year}<br />
                <strong>Genre:</strong> {randomMovie.genre?.name || 'Unknown'}<br />
                <strong>August's Score:</strong> {randomMovie.rating?.overall || 'N/A'}/10
            </p>
            <img 
                src={randomMovie.posterUrl}
                alt={`Poster for ${randomMovie.title}`}
                style={{ width: "300px", height: "auto", borderRadius: "8px" }}
            />

            {randomMovie.description && (
                <div style={{ marginTop: "10px" }}>
                    <p><strong>Description:</strong> {randomMovie.description}</p>
                    <p><strong>Box Office:</strong> {randomMovie.boxOffice}</p>
                    <p><strong>Awards:</strong> {randomMovie.awards}</p>
                </div>
            )}
            <br />
            <button onClick={handleClick}>Get Another Pick</button>{" "}
            <button onClick={handleGenerateAI} disabled={loadingAI}>
                {loadingAI ? "Generating..." : "Generate AI Info"}
            </button>
        </div>
    );
}

export default RandomMovieGenerator;
