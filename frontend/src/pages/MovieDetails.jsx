import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import placeholderImage from "../assets/placeholder.png";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const MovieDetails = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [email, setEmail] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
          params: {
            api_key: API_KEY,
          },
        });
        const genreMap = {};
        response.data.genres.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    const fetchMovies = async () => {
      if (query) {
        try {
          const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
              api_key: API_KEY,
              query,
            },
          });
          setMovies(response.data.results);
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      }
    };

    fetchGenres();
    fetchMovies();
  }, [query]);

  return (
    <Container>
      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : placeholderImage
                }
                alt={movie.title}
                onError={(e) => (e.target.src = placeholderImage)}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>
                  <strong>Release Date:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {movie.genre_ids.map((id) => genres[id]).join(", ")}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {movie.original_language.toUpperCase()}
                </p>
                <p>
                  <strong>IMDb:</strong> {movie.vote_average.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found for "{query}"</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 6rem 2rem 2rem 2rem; /* Adjust padding to prevent overlap with navbar */
  background-color: #333333; /* Slightly lighter background color */
  .movies-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center; /* Center the grid */
  }
  .movie-card {
    position: relative;
    width: 250px; /* Adjusted width for smaller cards */
    background-color: #222222; /* Background color for card */
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.05);
    }
    img {
      width: 100%;
      height: 350px; /* Adjusted height to maintain uniformity */
      object-fit: cover;
      border-radius: 8px;
    }
    .movie-info {
      text-align: left;
      width: 100%;
      padding: 0.5rem;
      color: #dddddd; /* Lighter text color */
      font-family: "Arial", sans-serif; /* Font styling */
      h3 {
        font-size: 1.2rem; /* Adjusted font size for better fit */
        margin: 0.5rem 0;
        color: #ffffff; /* White color for title text */
      }
      p {
        font-size: 0.9rem;
        margin: 0.2rem 0;
        color: #bbbbbb; /* Lighter gray color for additional info */
        font-family: "Arial", sans-serif; /* Font styling */
      }
    }
  }
`;

export default MovieDetails;
