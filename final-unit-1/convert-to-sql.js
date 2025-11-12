// convert-to-sql.js
import fs from "fs";

// Read JSON file
const movies = JSON.parse(
  fs.readFileSync("./src/LaunchCode_Final_API.json", "utf-8")
);

// Map genre names to IDs
const genreMap = {
  "Action": 1,
  "Comedy": 2,
  "Drama": 3,
  "Thriller": 4,
  "Sci-Fi": 5,
  "Musical": 6,
  "Horror": 7,
  "Fantasy": 8,
  "Animation": 9,
  "Adventure": 10,
  "Documentary": 11
};

let sql = "";

// Generate SQL for each movie and its rating
movies.forEach((movie) => {
  const genreId = genreMap[movie.Genre] || null; // fallback if genre not found
  const title = movie.Title ? String(movie.Title).replace(/'/g, "''") : "Unknown Title";
  const poster = movie.Poster ? String(movie.Poster) : "";

  sql += `
-- Movie: ${title}
INSERT INTO movie (title, year, poster_url, genre_id)
VALUES ('${title}', ${movie.Year || 0}, '${poster}', ${genreId});

INSERT INTO rating (writing, direction, cinematography, acting, editing, sound, soundtrack, production_design, casting, effects, overall, movie_id)
VALUES (${movie.Writing || 0}, ${movie.Direction || 0}, ${movie.Cinematography || 0}, ${movie.Acting || 0}, ${movie.Editing || 0}, ${movie.Sound || 0}, ${movie["Score/Soundtrack"] || 0}, ${movie["Production Design"] || 0}, ${movie.Casting || 0}, ${movie.Effects || 0}, ${movie.Average || 0}, LAST_INSERT_ID());
`;
});

// Write SQL to file
fs.writeFileSync("./import-movies.sql", sql);

console.log("SQL file generated: import-movies.sql");
