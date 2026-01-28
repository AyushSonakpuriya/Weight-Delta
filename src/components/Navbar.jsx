import { supabase } from "../lib/supabase";
import { NavLink } from "react-router-dom";
import "./Navbar.css";



export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="navbar-wrapper">
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
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}
