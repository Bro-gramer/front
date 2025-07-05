import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Reset password for:', email);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="illustration">
          <img
            src="src/assets/main.png"
            alt="School Illustration"
          />
        </div>
        <div className="reset-section">
          <div className="reset-header">
            <h1 className="reset-title">Forgot Password?</h1>
            <p className="reset-description">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="reset-button">
              Reset Password
            </button>
          </form>

          <a
            href="#"
            className="back-to-login"
            onClick={(e) => {
              e.preventDefault();
              onBackToLogin();
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;