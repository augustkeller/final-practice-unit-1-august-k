import { useState, useEffect } from 'react';
import { useAllMovies } from "./AllMovies";
import '../App.css';

function RandomMovieGenerator() {
    const { movies: allMovies, loading, error } = useAllMovies();
    const [randomMovie, setRandomMovie] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("Guest");

    //Get random movie
    function getRandomMovie() {
        if (!allMovies || allMovies.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        return allMovies[randomIndex];
    }

    function handleClick() {
        setRandomMovie(getRandomMovie());
    }

    //Generate AI info
    async function handleGenerateAI() {
        if (!randomMovie) return;
        try {
            setLoadingAI(true);
            const res = await fetch(`http://localhost:8080/api/movies/ai/${randomMovie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const updatedMovie = await res.json();
                setRandomMovie(updatedMovie);
            } else {
                alert(`Failed to generate AI content for "${randomMovie.title}"`);
            }
        } catch (err) {
            console.error("Error generating AI content:", err);
            alert("Error generating AI content. Check console for details.");
        } finally {
            setLoadingAI(false);
        }
    }

    //Load comments for selected movie
    useEffect(() => {
        async function fetchComments() {
            if (!randomMovie) return;
            try {
                const res = await fetch(`http://localhost:8080/api/comments/movie/${randomMovie.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (err) {
                console.error("Error loading comments:", err);
            }
        }
        fetchComments();
    }, [randomMovie]);

    //Add comment
    async function handleAddComment(e) {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:8080/api/comments/movie/${randomMovie.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    username: username || "Guest"
                }),
            });

            if (res.ok) {
                const saved = await res.json();
                setComments(prev => [...prev, saved]);
                setNewComment("");
            } else {
                alert("Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    }

//Delete comment
async function handleDeleteComment(commentId) {
    try {
        const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    } catch (err) {
        console.error("Error deleting comment:", err);
    }
}

    //Set initial movie
    useEffect(() => {
        if (allMovies && allMovies.length > 0) {
            setRandomMovie(getRandomMovie());
        }
    }, [allMovies]);

    //Conditional renders
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!randomMovie) return <div>No movies available</div>;

    return (
        <div className='random-recommendation'>
            <h2>Random Recommendation:</h2>
            <p>
                <strong>Title:</strong> {randomMovie.title}<br />
                <strong>Year:</strong> {randomMovie.year}<br />
                <strong>Genre:</strong> {randomMovie.genre?.name || 'Unknown'}<br />
                <strong>August's Score:</strong> {randomMovie.rating?.overall || 'N/A'}/10
            </p>

            <img 
                src={randomMovie.posterUrl}
                alt={`Poster for ${randomMovie.title}`}
                style={{ width: "300px", height: "auto", borderRadius: "8px" }}
            />

            {randomMovie.description && (
                <div style={{ marginTop: "10px" }}>
                    <p><strong>Description:</strong> {randomMovie.description}</p>
                    <p><strong>Box Office:</strong> {randomMovie.boxOffice}</p>
                    <p><strong>Awards:</strong> {randomMovie.awards}</p>
                </div>
            )}

            <br />
            <button onClick={handleClick}>Get Another Pick</button>{" "}
            <button onClick={handleGenerateAI} disabled={loadingAI}>
                {loadingAI ? "Generating..." : "Generate AI Info"}
            </button>

            {/* COMMENTS SECTION */}
            <div style={{ marginTop: "20px" }}>
                <h3>Comments</h3>

                {comments.length === 0 ? (
                    <p>No comments yet — be the first to add one!</p>
                ) : (
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                <strong>{comment.username}:</strong> {comment.content}
                                <button
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleAddComment} style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        style={{ width: "250px", marginRight: "10px" }}
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div>
    );
}

export default RandomMovieGenerator;
