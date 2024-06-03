import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useDispatch } from "react-redux";
import { removeMovieFromLiked } from "../store";
import video from "../assets/video.mp4";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

const Card = ({ index, movieData, isLiked = false, isFromMovieDetails = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [movieInfo, setMovieInfo] = useState(null); // State to store additional movie information

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieData.id}`, {
          params: {
            api_key: API_KEY,
          },
        });
        setMovieInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch movie info:", error);
      }
    };

    fetchMovieInfo();
  }, [movieData.id]);

  const addToList = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/add", {
        email,
        data: movieData,
      });
    } catch (error) {
      console.error("Error adding to list:", error);
    }
  };

  const handleRemove = () => {
    try {
      dispatch(removeMovieFromLiked({ movieId: movieData.id, email }));
    } catch (error) {
      console.error("Error removing from list:", error);
    }
  };

  const handleVideoClick = (e) => {
    const videoElement = e.target;
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { /* Firefox */
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
      videoElement.msRequestFullscreen();
    }
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      $isFromMovieDetails={isFromMovieDetails} 
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="card"
        onClick={() => navigate("/player")}
      />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt="card"
              onClick={() => navigate("/player")}
            />
            <video
              src={video}
              autoPlay={true}
              loop
              muted
              onClick={handleVideoClick}
            />
          </div>
          <InfoContainer>
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>
            {movieInfo && (
              <div className="additional-info">
                <p>
                  <strong>Release Date:</strong> {movieInfo.release_date}
                </p>
                <p>
                  <strong>IMDb:</strong> {movieInfo.vote_average}
                </p>
              </div>
            )}
            <div className="icons flex j-between">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="Play"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />
                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={handleRemove}
                  />
                ) : (
                  <AiOutlinePlus title="Add to my list" onClick={addToList} />
                )}
              </div>
              <div className="info">
                <BiChevronDown title="More Info" />
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li key={genre}>{genre}</li>
                ))}
              </ul>
            </div>
          </InfoContainer>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    z-index: 99;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: ${({ $isFromMovieDetails }) => ($isFromMovieDetails ? "0" : "-18vh")};
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      video {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 5;
        position: absolute;
      }
    }
  }
`;

const InfoContainer = styled.div`
  padding: 1rem;
  gap: 0.5rem;
  .additional-info {
    margin-bottom: 1rem;
    p {
      margin: 0;
      color: #bbbbbb;
    }
  }
  .icons {
    .controls {
      display: flex;
      gap: 1rem;
    }
    svg {
      font-size: 2rem;
      cursor: pointer;

      transition: 0.3s ease-in-out;
      &:hover {
        color:
        color: #b8b8b8;
      }
    }
  }
  .genres {
    ul {
      gap: 1rem;
      li {
        padding-right: 0.7rem;
        &:first-of-type {
          list-style-type: none;
        }
      }
    }
  }
`;

export default Card;
