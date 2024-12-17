// src/components/Navbar.js
import Button from './Button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/Global/logo.svg';
import logoutIcon from '../assets/ProfilePage/logout_button.svg';
import defaultProfilePicture from '../assets/ProfilePage/default_profile_pic.svg'; // Profile picture

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Check for token
    if (token) {
      // Optionally, add a simple check for token validity (not expired)
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear token
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false); // Update state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="logo-text">Peer-a-peer</span>
      </div>

      {/* Conditional Buttons */}
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            {/* Profile Picture Button */}
            <img
              src={defaultProfilePicture}
              alt="Profile"
              className="profile-button"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer', height: '40px', width: '40px', borderRadius: '50%' }}
            />

            {/* Logout Icon */}
            <img
              src={logoutIcon}
              alt="Log out"
              className="logout-button"
              onClick={handleLogout}
              style={{ cursor: 'pointer', height: '40px', width: '40px' }}
            />
          </>
        ) : (
          <div className="navbar-buttons">
          <Button text="Sign up" onClick={() => navigate('/signup')} className="black-button" />
          <Button text="Log in" onClick={() => navigate('/login')} className="outline-button" />
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
