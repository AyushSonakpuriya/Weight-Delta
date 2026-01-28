import { supabase } from "../lib/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";



export default function Navbar({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
        {session ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}
