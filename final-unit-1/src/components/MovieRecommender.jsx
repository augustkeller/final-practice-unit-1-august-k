import { useState } from "react";
import { useNavigate } from "react-router-dom";
import allMovies from "./AllMovies";
import CategorySelector from "./CategorySelector";
import GenreSelector from "./GenreSelector";
import YearSelector from "./YearSelector";

function MovieRecommender() {
    const navigate = useNavigate(); //The navigate function can be called with the target path as an argument.


    const years = allMovies.map(m => m.Year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [valueOldest, setValueOldest] = useState(minYear);
    const [valueNewest, setValueNewest] = useState(maxYear);

    function handleFilterClick(event) {
        event.preventDefault();

        const filtered = allMovies
            .filter(movie =>
                (!selectedGenre || movie.Genre === selectedGenre) &&
                movie.Year >= valueOldest &&
                movie.Year <= valueNewest
            ) //checks if no genres are selected, then filters by selected genres. Then filters by set years.
            .sort((a, b) => {
                const titleA = (a.Title || "").toString().toUpperCase();
                const titleB = (b.Title || "").toString().toUpperCase();

                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;

                return 0;
            }) //sort alphabetically
            .sort((a,b) => {
                return b.Average - a.Average;
            }) //sort by overall average
            .sort((a, b) => {
                const hasCategory = selectedCategories.length > 0 && !selectedCategories.includes("Overall");
                const avgA = hasCategory ? computeAverage(a, selectedCategories) : a.Average;
                const avgB = hasCategory ? computeAverage(b, selectedCategories) : b.Average;

                return avgB - avgA;
            }); //sort by selected categories average or by overall average again if not categories are selected.

        navigate("/Results", { state: { movies: filtered, categories: selectedCategories } });
    } //The navigate function can be called with the target path as an argument. Also passing data.

    function computeAverage(movie, categories) {
        if (categories.includes("Overall") || categories.length === 0) {
            return movie.Average ?? 0;
        }
        const total = categories.reduce((sum, category) => sum + movie[category], 0);
        return total / categories.length;
    } //computes average value of selected categories.

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