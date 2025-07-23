function CategorySelector(props) {
    function HandleChange(event) {
        const value = event.target.value;
        const checked = event.target.checked;

        props.setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(category => category !== value) //If check, add value to prev array. If unchecked, remove with filter.
        );
    }

    return (
        <div className="category-selector">
            <h2>Preferred Categories</h2>
            <input type="checkbox" value="Writing" onChange={HandleChange} /> Writing<br />
            <input type="checkbox" value="Direction" onChange={HandleChange} /> Direction<br />
            <input type="checkbox" value="Cinematography" onChange={HandleChange} /> Cinematography<br />
            <input type="checkbox" value="Acting" onChange={HandleChange} /> Acting<br />
            <input type="checkbox" value="Editing" onChange={HandleChange} /> Editing<br />
            <input type="checkbox" value="Sound" onChange={HandleChange} /> Sound<br />
            <input type="checkbox" value="Score/Soundtrack" onChange={HandleChange} /> Score/Soundtrack<br />
            <input type="checkbox" value="Production Design" onChange={HandleChange} /> Production Design<br />
            <input type="checkbox" value="Casting" onChange={HandleChange} /> Casting<br />
            <input type="checkbox" value="Effects" onChange={HandleChange} /> Effects<br />
            <input type="checkbox" value="Overall" onChange={HandleChange} /> Overall<br />
        </div>
    );
}

export default CategorySelector;