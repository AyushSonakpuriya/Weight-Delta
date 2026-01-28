import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
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
      </nav>
    </header>
  );
}
