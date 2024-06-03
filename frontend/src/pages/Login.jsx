import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import background from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.log(error.code);
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header />
        <div className="form-container flex column a-center j-center">
          <div className="form flex column a-center j-center">
            <div className="title">
              <h3>Login</h3>
            </div>
            <div className="container flex column">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button onClick={handleLogin}>Login to your account</button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    grid-template-rows: 15vh 85vh;
    .form-container {
      gap: 2rem;
      height: 85vh;
      .form {
        padding: 2rem;
        background-color: #000000b0;
        width: 30vw; /* Adjusted width */
        gap: 2rem;
        color: white;
        border-radius: 10px; /* Added border radius */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Added box shadow */
        .container {
          gap: 2rem;
          input {
            padding: 0.8rem 1rem; /* Adjusted padding */
            width: 100%; /* Full width */
            border: none;
            border-bottom: 2px solid #ddd; /* Added border bottom */
            background-color: transparent; /* Transparent background */
            color: white;
            outline: none;
            font-size: 1.1rem; /* Increased font size */
          }
          button {
            padding: 0.8rem 1rem; /* Adjusted padding */
            width: 100%; /* Full width */
            background-color: #e50914;
            border: none;
            cursor: pointer;
            color: white;
            border-radius: 0.2rem;
            font-weight: bold;
            font-size: 1.2rem; /* Increased font size */
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #d30813; /* Darker shade on hover */
          }
        }
      }
    }
  }
`;

export default Login;
