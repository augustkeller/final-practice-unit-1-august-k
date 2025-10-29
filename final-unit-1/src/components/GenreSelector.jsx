import { useState, useEffect } from 'react';

function GenreSelector(props) {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch genres from backend
    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await fetch('http://localhost:8080/api/genres');
                if (!response.ok) throw new Error('Failed to fetch genres');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGenres();
    }, []);

    function handleChange(event) {
        props.setSelectedGenre(event.target.value);
    }

    if (loading) return <div>Loading genres...</div>;

    return (
        <div className="genre-selector">
            <h2>Preferred Genre</h2>
            <select value={props.selectedGenre} onChange={handleChange}>
                <option value="">---Select---</option>
                {genres.map(genre => (
                    <option key={genre.id} value={genre.name}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default GenreSelector;