// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/Navbar.css';
import logo from '../assets/Global/logo.svg';
import logoutIcon from '../assets/ProfilePage/logout_button.svg';
import defaultProfilePicture from '../assets/ProfilePage/default_profile_pic.svg';
import { withLogger } from './withLogger';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="logo-text">Peer-a-peer</span>
      </div>

      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <img
              src={defaultProfilePicture}
              alt="Profile"
              className="profile-button"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer', height: '40px', width: '40px', borderRadius: '50%' }}
            />
            <img
              src={logoutIcon}
              alt="Log out"
              className="logout-button"
              onClick={handleLogout}
              style={{ cursor: 'pointer', height: '40px', width: '40px' }}
            />
          </>
        ) : (
          <>
            <Button text="Sign up" onClick={() => navigate('/signup')} className="black-button" />
            <Button text="Log in" onClick={() => navigate('/login')} className="outline-button" />
          </>
        )}
      </div>
    </nav>
  );
};

export default withLogger(Navbar);
