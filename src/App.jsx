import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Settings from "./components/Settings";
import Home from "./components/Home";
import Materials from "./components/Materials";
import Task from "./components/Task";
import Grade from "./components/Grade";
import Attendance from "./components/Attendance";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import Start from "./components/Start";
import ForgotPassword from "./components/ForgotPassword";
import Admin from "./components/Admine";
import RegisterSuccess from "./components/RegisterSuccess";
import { auth } from "./firebase/Config";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);

  // NEW: Active class state
  const [activeClassName, setActiveClassName] = useState("Nursery"); // default

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return console.log("loading");
  }

  return (
    <Router>
      <Routes>
        {/* Always accessible, regardless of auth state */}
        <Route path="/register-success" element={<RegisterSuccess />} />

        {!user ? (
          <>
            <Route
              path="/login"
              element={
                <Login
                  onCreateAccount={() =>
                    window.location.replace("/create-account")
                  }
                />
              }
            />
            <Route
              path="/create-account"
              element={
                <Start
                  onLogin={() => window.location.replace("/login")}
                  onForgotPassword={() =>
                    window.location.replace("/forgot-password")
                  }
                  step={registrationStep}
                  onNextStep={() => setRegistrationStep((prev) => prev + 1)}
                  onPrevStep={() => setRegistrationStep((prev) => prev - 1)}
                  onComplete={() => window.location.replace("/login")}
                />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ForgotPassword
                  onBackToLogin={() => window.location.replace("/login")}
                />
              }
            />
            {/* Wildcard route LAST, so /register-success is not overridden */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route
              path="*"
              element={
                <>
                  <Sidebar
                    activeClassName={activeClassName}
                    setActiveClassName={setActiveClassName}
                  />
                  <main className="main-content">
                    <div className="content-wrapper">
                      <Routes>
                        <Route
                          path="/home"
                          element={
                            <Home
                              activeClassName={activeClassName}
                              setActiveClassName={setActiveClassName}
                            />
                          }
                        />
                        <Route
                          path="/settings"
                          element={<Settings onLogout={() => auth.signOut()} />}
                        />
                        <Route
                          path="/materials"
                          element={
                            <Materials
                              onBack={() => window.location.replace("/home")}
                            />
                          }
                        />
                        <Route
                          path="/task"
                          element={
                            <Task
                              onBack={() => window.location.replace("/home")}
                            />
                          }
                        />
                        <Route
                          path="/grade"
                          element={
                            <Grade
                              onBack={() => window.location.replace("/home")}
                            />
                          }
                        />
                        <Route
                          path="/attendance"
                          element={
                            <Attendance
                              onBack={() => window.location.replace("/home")}
                            />
                          }
                        />
                        <Route
                          path="/calendar"
                          element={
                            <Calendar
                              onBack={() => window.location.replace("/home")}
                            />
                          }
                        />
                        <Route path="/admine" element={<Admin />} />
                        <Route
                          path="*"
                          element={<Navigate to="/home" replace />}
                        />
                      </Routes>
                    </div>
                  </main>
                </>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
