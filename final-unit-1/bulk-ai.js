async function bulkGenerateAI() {
  try {
    // 1. Fetch all movies from backend
    const allMoviesRes = await fetch("http://localhost:8080/api/movies");
    const allMovies = await allMoviesRes.json();

    for (const movie of allMovies) {
      const id = movie.id;
      try {
        const res = await fetch(`http://localhost:8080/api/movies/ai/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const updated = await res.json();
          console.log(`AI generated for: ${updated.title}`);
        } else {
          console.error(`Failed for movie ID ${id}`);
        }
      } catch (err) {
        console.error(`Error for movie ID ${id}:`, err);
      }
    }

    console.log("Bulk AI generation complete!");
  } catch (err) {
    console.error("Failed to fetch movies:", err);
  }
}

bulkGenerateAI();
