import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/Config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import API_BASE from "../../config";

function Login({ onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Sign in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 👉 Store schoolId in localStorage
      localStorage.setItem("schoolId", user.uid);

      // 2. Get the ID token
      const idToken = await user.getIdToken();

      // 3. Send token to backend for verification
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Backend verification failed");
      }

      const userData = await response.json();
      console.log("User verified:", userData);

      // 4. Navigate to /home if successful
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to log in. Please try again.");
    }
  };

  return (
    <div className="start-container">
      <div className="start-content">
        <div className="illustration">
          <img src="src/assets/main.png" alt="" />
        </div>
        <div className="login-section">
          <div className="login-header">
            <h1 className="login-title">
              Welcome to Talk<sup>2</sup>School
            </h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>

            <p className="create-account-link">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount();
                }}
              >
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
