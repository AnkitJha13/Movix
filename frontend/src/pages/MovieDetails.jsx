import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import placeholderImage from "../assets/placeholder.png";
import backgroundImage from "../assets/movie-website.jpg";
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
        <p className="no-movies-found">No movies found for "{query}"</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 8rem 2rem 6rem 2rem;
  background: url(${backgroundImage}) no-repeat center center/cover;
  .movies-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
  }
  .movie-card {
    position: relative;
    width: 225px;
    height: 455px;
    background-color: #222222;
    margin-bottom: 2rem;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.05);
    }
    img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }
    .movie-info {
      text-align: left;
      width: 100%;
      padding: 0.5rem;
      color: #dddddd;
      font-family: "Arial", sans-serif;
      h3 {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #ffffff;
      }
      p {
        font-size: 0.8rem;
        margin: 0.2rem 0;
        color: #bbbbbb;
        font-family: "Arial", sans-serif;
      }
    }
  }
  
  /* Media Queries for Responsiveness */
  @media (max-width: 1024px) {
    .movie-card {
      width: 200px;
      height: 440px;
      img {
        height: 280px;
      }
      .movie-info {
        h3 {
          font-size: 0.9rem;
        }
        p {
          font-size: 0.75rem;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .movie-card {
      width: 180px;
      height: 400px;
      img {
        height: 250px;
      }
      .movie-info {
        h3 {
          font-size: 0.85rem;
        }
        p {
          font-size: 0.7rem;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 4rem 1rem 1rem 1rem;
    .movie-card {
      width: 150px;
      height: 350px;
      img {
        height: 220px;
      }
      .movie-info {
        h3 {
          font-size: 0.8rem;
        }
        p {
          font-size: 0.65rem;
        }
      }
    }
  }

  .no-movies-found {
    font-size: 1.7rem;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin-top: 2rem;
  }
`;

export default MovieDetails;

