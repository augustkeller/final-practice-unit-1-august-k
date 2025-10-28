import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAllMovies } from "./AllMovies";
import CategorySelector from "./CategorySelector";
import GenreSelector from "./GenreSelector";
import YearSelector from "./YearSelector";

function MovieRecommender() {
    const navigate = useNavigate();
    const { movies: allMovies, loading, error } = useAllMovies(); //fetch movies from backend

    //Declare all hooks BEFORE any conditional returns
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [valueOldest, setValueOldest] = useState(1888);
    const [valueNewest, setValueNewest] = useState(2100);

    //Update year range when movies load
    useEffect(() => {
        if (allMovies && allMovies.length > 0) {
            const years = allMovies.map(m => m.year); // lowercase 'year' from backend
            setValueOldest(Math.min(...years));
            setValueNewest(Math.max(...years));
        }
    }, [allMovies]);

    //Conditional returns AFTER hooks
    if (loading) return <div>Loading movies...</div>;
    if (error) return <div>Error loading movies: {error}</div>;
    if (!allMovies || allMovies.length === 0) return <div>No movies available</div>;

    const years = allMovies.map(m => m.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    function handleFilterClick(event) {
        event.preventDefault();

        const filtered = allMovies
            .filter(movie =>
                //checks if no genres are selected, then filters by selected genres
                (!selectedGenre || movie.genre?.name === selectedGenre) &&
                movie.year >= valueOldest &&
                movie.year <= valueNewest
            )
            .sort((a, b) => {
                //sort alphabetically by title
                const titleA = (a.title || "").toString().toUpperCase();
                const titleB = (b.title || "").toString().toUpperCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            })
            .sort((a, b) => {
                //sort by overall average rating
                const avgA = a.rating?.overall || 0;
                const avgB = b.rating?.overall || 0;
                return avgB - avgA;
            })
            .sort((a, b) => {
                // sort by selected category averages, or overall average if none are selected
                const hasCategory = selectedCategories.length > 0 && !selectedCategories.includes("Overall");
                const avgA = hasCategory ? computeAverage(a, selectedCategories) : (a.rating?.overall || 0);
                const avgB = hasCategory ? computeAverage(b, selectedCategories) : (b.rating?.overall || 0);
                return avgB - avgA;
            });

        //navigate to results page and pass filtered data
        navigate("/Results", { state: { movies: filtered, categories: selectedCategories } });
    }

    function computeAverage(movie, categories) {
        if (!movie.rating) return 0;
        if (categories.includes("Overall") || categories.length === 0) {
            return movie.rating.overall ?? 0;
        }

        //Map display category names to backend field names
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

        //computes average value of selected categories
        const total = categories.reduce((sum, category) => {
            const fieldName = categoryMap[category];
            return sum + (movie.rating[fieldName] || 0);
        }, 0);

        return total / categories.length;
    }

    return (
        <form className="movie-filter" onSubmit={handleFilterClick}>
            <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />

            <GenreSelector
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
            />

            <YearSelector
                valueOldest={valueOldest}
                setValueOldest={setValueOldest}
                valueNewest={valueNewest}
                setValueNewest={setValueNewest}
                minYear={minYear}
                maxYear={maxYear}
            />

            <button type="submit">Get Recommendations</button>
        </form>
    );
}

export default MovieRecommender;
