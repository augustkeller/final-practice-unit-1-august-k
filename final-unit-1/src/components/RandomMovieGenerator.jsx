import { useState } from 'react';
import allMovies from './AllMovies';
import '../App.css';

function RandomMovieGenerator() {
    function getRandomMovie() {
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        return allMovies[randomIndex];
    };

    const [randomMovie, setRandomMovie] = useState(getRandomMovie());

    function handleClick() {
        return setRandomMovie(getRandomMovie());
    };

    return (
        <div className='random-recommendation'>
            <h2>Random Recommendation:</h2>
            <p>
                Title: {randomMovie.Title}
                <br />
                Year: {randomMovie.Year}
                <br />
                Genre: {randomMovie.Genre}
                <br />
                August's Score: {randomMovie.Average}/10
            </p>
            <img 
                src={randomMovie.Poster}
                alt={`Poster for ${randomMovie.Title}`}
            />
            <br />
            <button onClick={handleClick}>Get Another Pick</button>
        </div>
    );
}

export default RandomMovieGenerator;