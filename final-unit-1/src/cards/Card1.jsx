import React from 'react';

function Card1({ title, blurb, image }) {
    return (
        <div className="about-card">
            <h2>{title}</h2>
            <img src={image} alt={title} />
            <p>{blurb}</p>
        </div>
    );
}

export default Card1;
