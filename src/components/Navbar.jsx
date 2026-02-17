import { useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar({ session }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [isRotating, setIsRotating] = useState(false);
  const navRef = useRef(null);
  const highlightRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLogoClick = () => {
    setIsRotating(true);
  };

  const handleItemEnter = useCallback((e) => {
    const target = e.currentTarget;
    const nav = navRef.current;
    const highlight = highlightRef.current;
    if (!nav || !highlight) return;

    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    highlight.style.width = `${targetRect.width}px`;
    highlight.style.height = `${targetRect.height}px`;
    highlight.style.left = `${targetRect.left - navRect.left}px`;
    highlight.style.top = `${targetRect.top - navRect.top}px`;
    highlight.style.opacity = '1';
  }, []);

  const handleNavLeave = useCallback(() => {
    const highlight = highlightRef.current;
    if (!highlight) return;
    highlight.style.opacity = '0';
  }, []);

  return (
    <header className="navbar-wrapper">
      <div
        className={`navbar-logo ${isRotating ? "rotating" : ""}`}
        onClick={handleLogoClick}
        onAnimationEnd={() => setIsRotating(false)}
      >
        <img src="/weighing scale.png" alt="Weight Delta" />
      </div>
      <nav className="navbar" ref={navRef} onMouseLeave={handleNavLeave}>
        <div className="navbar__highlight" ref={highlightRef} />

        <NavLink to="/" end onMouseEnter={handleItemEnter}>
          Home
        </NavLink>
        <NavLink to="/calculator" onMouseEnter={handleItemEnter}>
          Calculator
        </NavLink>
        <NavLink to="/about" onMouseEnter={handleItemEnter}>
          About
        </NavLink>

        <span className="navbar__separator" />

        {session ? (
          <>
            <NavLink to="/history" onMouseEnter={handleItemEnter}>History</NavLink>
            <button onClick={handleLogout} onMouseEnter={handleItemEnter}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onMouseEnter={handleItemEnter}>Login</NavLink>
            <NavLink to="/signup" onMouseEnter={handleItemEnter}>Sign Up</NavLink>
          </>
        )}

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle Dark Mode"
          onMouseEnter={handleItemEnter}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
}
