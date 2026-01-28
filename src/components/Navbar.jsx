import { supabase } from "../lib/supabase";
import { NavLink } from "react-router-dom";
import "./Navbar.css";



export default function Navbar({ session }) {
  const handleLogout = async () => {
    console.log('Logout clicked');
    const { error } = await supabase.auth.signOut();
    console.log('Logout result - error:', error);
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
