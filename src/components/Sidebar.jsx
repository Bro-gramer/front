import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, User, GraduationCap } from "lucide-react";
import "./Sidebar.css";

function Sidebar({ activeClassName, setActiveClassName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };



  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <Menu size={24} />
      </button>

      <div
        className={`sidebar ${isMobileMenuOpen ? "sidebar-mobile-open" : ""}`}
      >
        <div className="logo-container">
          <h1 className="logo">
            Talk<sup>2</sup>School
          </h1>
        </div>

        <nav className="nav-menu">
          <ul>
            <li>
              <button
                className={`menu-button${activeClassName === "Nursery" ? " active" : ""
                  }`}
                onClick={() => {
                  setActiveClassName("Nursery");
                  navigate("/home");
                }}
              >
                <GraduationCap className="menu-icon" />
                <span className="menu-text">Nursery</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-button${activeClassName === "KG-1" ? " active" : ""
                  }`}
                onClick={() => {
                  setActiveClassName("KG-1");
                  navigate("/home");
                }}
              >
                <GraduationCap className="menu-icon" />
                <span className="menu-text">KG-1</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-button${activeClassName === "KG-2" ? " active" : ""
                  }`}
                onClick={() => {
                  setActiveClassName("KG-2");
                  navigate("/home");
                }}
              >
                <GraduationCap className="menu-icon" />
                <span className="menu-text">KG-2</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="top-bar">
        <div className="top-bar-content">

          <div className="user-actions">
            <button
              className="theme-toggle"
              onClick={() => navigate("/settings")}
              aria-label="Settings"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
