import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
            <Link to="/">
                <button>Home</button>
            </Link>
            <Link to="/RecommendationSearchPage">
                <button>Recommendation Search</button>
            </Link>
            <Link to="/AboutPage">
                <button>About Page</button>
            </Link>
        </>
    )
}

export default Navbar;