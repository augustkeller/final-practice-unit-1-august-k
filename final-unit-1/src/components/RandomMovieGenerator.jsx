import { useState, useEffect } from 'react';
import { useAllMovies } from "./AllMovies";
import '../App.css';

function RandomMovieGenerator() {
    const { movies: allMovies, loading, error } = useAllMovies();
    const [randomMovie, setRandomMovie] = useState(null);

    function getRandomMovie() {
        if (!allMovies || allMovies.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        return allMovies[randomIndex];
    }

    function handleClick() {
        setRandomMovie(getRandomMovie());
    }

    // Set initial random movie once movies are loaded
    useEffect(() => {
        if (allMovies && allMovies.length > 0) {
            setRandomMovie(getRandomMovie());
        }
    }, [allMovies]);

    // Conditional returns AFTER hooks
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!allMovies || allMovies.length === 0) return <div>No movies available</div>;
    if (!randomMovie) return <div>No movies available</div>;

    return (
        <div className='random-recommendation'>
            <h2>Random Recommendation:</h2>
            <p>
                Title: {randomMovie.title}
                <br />
                Year: {randomMovie.year}
                <br />
                Genre: {randomMovie.genre?.name || 'Unknown'}
                <br />
                August's Score: {randomMovie.rating?.overall || 'N/A'}/10
            </p>
            <img 
                src={randomMovie.posterUrl}
                alt={`Poster for ${randomMovie.title}`}
            />
            <br />
            <button onClick={handleClick}>Get Another Pick</button>
        </div>
    );
}

export default RandomMovieGenerator;