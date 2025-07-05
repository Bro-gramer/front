import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "./RegisterSuccess.css";

function RegisterSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");

  return (
    <div className="register-success-container">
      <h1>Registration Successful!</h1>
      <p>Thank you for registering. Your payment was successful.</p>
      {sessionId && (
        <p>
          Your Session ID: <strong>{sessionId}</strong>
        </p>
      )}
      <button className="home-button" onClick={() => navigate("/login")}>
        Go to Dashboard
      </button>
    </div>
  );
}

export default RegisterSuccess;
