import { useState } from "react";
import { supabase } from "../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";



export default function Navbar({ session }) {
  const navigate = useNavigate();

  const [isRotating, setIsRotating] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLogoClick = () => {
    setIsRotating(true);
  };

  return (
    <header className="navbar-wrapper">
      <div
        className={`navbar-logo ${isRotating ? "rotating" : ""}`}
        onClick={handleLogoClick}
        onAnimationEnd={() => setIsRotating(false)}
      >
        <img src="/weighing scale.png" alt="Weight Delta" />
      </div>
      <nav className="navbar">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/calculator">
          Calculator
        </NavLink>
        <NavLink to="/about">
          About
        </NavLink>

        <span className="navbar__separator" />

        {session ? (
          <>
            <NavLink to="/history">History</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
