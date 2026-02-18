import { useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ session }) {
  const navigate = useNavigate();

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
      </nav>
    </header>
  );
}

