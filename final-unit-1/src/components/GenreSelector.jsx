function GenreSelector(props) {
    function HandleChange(event) {
        props.setSelectedGenre(event.target.value);
    }

    return (
        <div className="genre-selector">
            <h2>Preferred Genre</h2>
            <select value={props.selectedGenre} onChange={HandleChange}>
                <option value="">---Select---</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Thriller">Thriller</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Musical">Musical</option>
                <option value="Horror">Horror</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Animation">Animation</option>
                <option value="Adventure">Adventure</option>
                <option value="Documentary">Documentary</option>
            </select>
        </div>
    );
}

export default GenreSelector;