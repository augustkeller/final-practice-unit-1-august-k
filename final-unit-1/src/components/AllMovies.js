import { useState, useEffect } from 'react';

export const useAllMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/movies');
                if (!response.ok) throw new Error('Failed to fetch movies');
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    return { movies, loading, error };
};