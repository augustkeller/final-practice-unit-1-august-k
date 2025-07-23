import React from 'react';
import Card1 from '../cards/Card1';
import data from '../About_Page_Info.json';

function AboutPage() {
    return (
        <>
            <h1>About page</h1>
            <div className="card-container">
                {data.map((item, index) => (
                    <Card1
                        key={index}
                        title={item.Subject}
                        blurb={item.Blurb}
                        image={item.Image}
                    />
                ))}
            </div>
        </>
    );
}

export default AboutPage;
