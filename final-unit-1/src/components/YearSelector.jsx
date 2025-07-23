function YearSelector(props) {
    return (
        <div className="year-selector">
            <h2>Preferred Year Range</h2>

            <label>Oldest Year: {props.valueOldest}</label>
            <input
                type="range"
                min={props.minYear}
                max={props.valueNewest}
                value={props.valueOldest}
                onChange={event => props.setValueOldest(Number(event.target.value))}
            />

            <label>Newest Year: {props.valueNewest}</label>
            <input
                type="range"
                min={props.valueOldest}
                max={props.maxYear}
                value={props.valueNewest}
                onChange={event => props.setValueNewest(Number(event.target.value))}
            />
        </div>
    );
}

export default YearSelector;
