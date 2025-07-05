import React, { useState } from "react";
import "./Start.css";

import API_BASE from "../../config";

function Start({
  onLogin,
  onForgotPassword,
  step,
  onNextStep,
  onPrevStep,
  onComplete,
}) {
  // Step 1: Create Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Step 2: School Info
  const [schoolInfo, setSchoolInfo] = useState({ description: "" });

  // Step 3: Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("chapa");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }
    onNextStep();
  };

  const handleSchoolInfo = (e) => {
    e.preventDefault();
    if (!schoolInfo.description) {
      alert("Please provide a description for your school");
      return;
    }
    onNextStep();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolName,
            email,
            phoneNumber,
            password,
            description: schoolInfo.description,
          }),
        }
      );

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP error! Status: ${response.status}`,
        }));
        throw new Error(errorData.error || "Payment failed");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("No redirect URL received");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="start-container">
      <div className="start-content">
        <div className="illustration">
          <img src="src/assets/main.png" alt="School Illustration" />
        </div>
        <div className="login-section">
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? "completed" : ""}`}>
              <div className="step-icon">1</div>
              <span className="step-text">Create Account</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 2 ? "completed" : ""}`}>
              <div className="step-icon">2</div>
              <span className="step-text">Add School</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 3 ? "completed" : ""}`}>
              <div className="step-icon">3</div>
              <span className="step-text">Payment</span>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="login-header">
                <h1 className="login-title">Create account</h1>
                <p className="login-subtitle">to add and manage your school</p>
              </div>
              <form className="login-form" onSubmit={handleCreateAccount}>
                <div className="form-group">
                  <label htmlFor="schoolName" className="form-label">
                    School name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    className="form-input"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
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
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="form-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
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
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      required
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">
                      I agree to all the{" "}
                      <a href="#" className="terms-link">
                        Terms
                      </a>{" "}
                      &{" "}
                      <a href="#" className="privacy-link">
                        Privacy
                      </a>{" "}
                      Policy
                    </span>
                  </label>
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="back-button"
                    onClick={onLogin}
                  >
                    Back to Login
                  </button>
                  <button type="submit" className="submit-button">
                    Next
                  </button>
                </div>
                <p className="login-link">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onLogin();
                    }}
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="login-header">
                <h1 className="login-title">School information</h1>
              </div>
              <form className="login-form" onSubmit={handleSchoolInfo}>
                <div className="form-group">
                  <label htmlFor="schoolInfoDescription" className="form-label">
                    Add description
                  </label>
                  <textarea
                    id="schoolInfoDescription"
                    name="description"
                    className="form-input"
                    value={schoolInfo.description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                  />
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="back-button"
                    onClick={onPrevStep}
                  >
                    Back
                  </button>
                  <button type="submit" className="submit-button">
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div className="login-header">
                <h1 className="login-title">Payment</h1>
                <p className="login-subtitle">
                  Complete your registration with a one-time payment
                </p>
              </div>
              <form className="login-form" onSubmit={handlePayment}>
                <div className="form-group">
                  <div className="payment-amount">
                    <h2 className="amount-title">Registration Fee</h2>
                    <p className="amount-value">10,000 ETB</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Select Payment Method</label>
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="chapa"
                        checked={selectedPaymentMethod === "chapa"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                      />
                      <span className="payment-method-content">
                        <span className="payment-method-name">Chapa</span>
                        <span className="payment-method-description">
                          Pay with bank transfer or mobile money
                        </span>
                      </span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={selectedPaymentMethod === "bank"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                      />
                      <span className="payment-method-content">
                        <span className="payment-method-name">
                          Bank Transfer
                        </span>
                        <span className="payment-method-description">
                          Direct bank transfer to our account
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="back-button"
                    onClick={onPrevStep}
                    disabled={isProcessing}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Start;
