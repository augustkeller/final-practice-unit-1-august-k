import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Results() {
    const location = useLocation();
    const { movies: initialMovies, categories } = location.state || { movies: [], categories: [] };

    const [movies, setMovies] = useState(initialMovies);
    const [loadingId, setLoadingId] = useState(null); // track which movie is currently generating AI data
    const [commentInputs, setCommentInputs] = useState({}); // track new comment input per movie

    function handleDelete(indexToRemove) {
        setMovies(prevMovies => prevMovies.filter((_, i) => i !== indexToRemove));
    } // remove movie from the list based on its index in the array. _ is a placeholder for the item itself (not used). i is the index of each movie.

    async function handleGenerateAI(movieId) {
        try {
            setLoadingId(movieId); // show which movie is currently being updated
            const res = await fetch(`http://localhost:8080/api/movies/ai/${movieId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const updatedMovie = await res.json();
                setMovies(prevMovies =>
                    prevMovies.map(m => (m.id === movieId ? updatedMovie : m))
                ); // update the state with the AI-enhanced movie data
                alert(`AI content generated for "${updatedMovie.title}"`);
            } else {
                alert(`Failed to generate AI content for movie ID ${movieId}`);
            }
        } catch (err) {
            console.error("Error generating AI content:", err);
            alert("Error generating AI content. Check console for details.");
        } finally {
            setLoadingId(null); // reset loading state once done
        }
    }

    function getCategoryScores(movie) {
        if (categories.length === 0 || categories.includes("Overall")) {
            return `Overall Score: ${movie.rating?.overall || 'N/A'}`;
        } // checks if no categories or overall category was selected

        // Map display names to backend field names
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

        return categories
            .map(cat => {
                const fieldName = categoryMap[cat];
                const score = movie.rating?.[fieldName] || 'N/A';
                return `${cat}: ${score}`;
            })
            .join(", "); // maps the selected categories and their accompanying scores
    }

    //Fetch comments for a single movie
    async function fetchComments(movieId) {
        try {
            const res = await fetch(`http://localhost:8080/api/comments/movie/${movieId}`);
            if (res.ok) {
                const data = await res.json();
                setMovies(prevMovies =>
                    prevMovies.map(m => (m.id === movieId ? { ...m, comments: data } : m))
                );
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }

    //Add a comment
    async function handleAddComment(e, movieId) {
        e.preventDefault();
        const content = commentInputs[movieId]?.trim();
        if (!content) return;

        try {
            const username = "Guest"; // replace with actual logged-in user if applicable
            const res = await fetch(`http://localhost:8080/api/comments/movie/${movieId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, content })
            });
            if (res.ok) {
                const newComment = await res.json();
                setMovies(prevMovies =>
                    prevMovies.map(m =>
                        m.id === movieId ? { ...m, comments: [...(m.comments || []), newComment] } : m
                    )
                );
                setCommentInputs(prev => ({ ...prev, [movieId]: "" }));
            }
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    }

    //Delete a comment
    async function handleDeleteComment(commentId, movieId) {
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setMovies(prevMovies =>
                    prevMovies.map(m =>
                        m.id === movieId
                            ? { ...m, comments: m.comments.filter(c => c.id !== commentId) }
                            : m
                    )
                );
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    }

    return (
        <div className="results">
            <h1>Personalized Recommendations</h1>

            {movies.length === 0 ? (
                <p>No movie recommendations left. Please adjust your preferences.</p>
            ) : (
                <ol>
                    {movies.slice(0, 5).map((movie, index) => (
                        <li key={index}>
                            {movie.title} ({movie.genre?.name || 'Unknown'}, {movie.year}) — {getCategoryScores(movie)}
                            <br />
                            <img 
                                src={movie.posterUrl}
                                alt={`Poster for ${movie.title}`}
                                style={{ width: "150px", height: "auto", borderRadius: "4px" }}
                            />
                            <br />

                            {/* Show the AI-generated info if it already exists */}
                            {movie.description && (
                                <div style={{ marginTop: "8px" }}>
                                    <p><strong>Description:</strong> {movie.description}</p>
                                    <p><strong>Box Office:</strong> {movie.boxOffice}</p>
                                    <p><strong>Awards:</strong> {movie.awards}</p>
                                </div>
                            )}

                            {/* Button controls for each movie */}
                            <button onClick={() => handleDelete(index)}>
                                Delete
                            </button>{" "}
                            <button
                                onClick={() => handleGenerateAI(movie.id)}
                                disabled={loadingId === movie.id}
                            >
                                {loadingId === movie.id ? "Generating..." : "Generate AI Info"}
                            </button>

                            {/* --- COMMENTS SECTION --- */}
                            <div style={{ marginTop: "10px" }}>
                                <h4>Comments:</h4>
                                {(!movie.comments || movie.comments.length === 0) ? (
                                    <p>No comments yet — be the first to add one!</p>
                                ) : (
                                    <ul>
                                        {movie.comments.map(comment => (
                                            <li key={comment.id}>
                                                <strong>{comment.username}:</strong> {comment.content}
                                                <button
                                                    style={{ marginLeft: "8px" }}
                                                    onClick={() => handleDeleteComment(comment.id, movie.id)}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <form onSubmit={(e) => handleAddComment(e, movie.id)} style={{ marginTop: "5px" }}>
                                    <input
                                        type="text"
                                        value={commentInputs[movie.id] || ""}
                                        onChange={(e) =>
                                            setCommentInputs(prev => ({ ...prev, [movie.id]: e.target.value }))
                                        }
                                        placeholder="Add a comment"
                                        style={{ width: "200px", marginRight: "5px" }}
                                    />
                                    <button type="submit">Submit</button>
                                </form>
                            </div>

                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

export default Results;
