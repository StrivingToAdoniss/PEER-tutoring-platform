// src/components/Navbar.js
import '../styles/Navbar.css';  // If you want to add CSS for styling
import Button from './Button';
import NavLink from './NavLink';
import logo from '../assets/logo.svg'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Logo image next to the Peer-a-peer text */}
        <img src={logo} alt="Logo" className="logo-image" />
        Peer-a-peer
      </div>
      <ul className="navbar-links">
        <li><NavLink href="#main">MAIN</NavLink></li>
        <li><NavLink href="#tutors">TUTORS</NavLink></li>
      </ul>
      <div className="navbar-buttons">
        <Button text="Sign up" onClick={() => {}} className="black-button" />
        <Button text="Log in" onClick={() => {}} className="outline-button" />
      </div>
    </nav>
  );
};

export default Navbar;
