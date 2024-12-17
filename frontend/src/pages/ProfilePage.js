import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Global/logo.svg';
import defaultProfilePicture from '../assets/ProfilePage/default_profile_pic.svg'; // Fallback image
import '../styles/ProfilePage.css';
import logoutIcon from '../assets/ProfilePage/logout_button.svg';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
      name: 'Name Surname',
      username: '@username',
      university: 'Mock University',
      specialization: 'Mock Specialization',
      year: '3rd year',
      password: '••••',
      email: 'mockemail@example.com',
      photo_url: defaultProfilePicture,
      role: 'STUDENT', // Role can be TUTOR or STUDENT
      subject: 'Mock Subject',
      confirmation_file: 'mock_certificate.pdf',
    });

    const handleLogoClick = () => {
        navigate('/'); // Redirect to the main page
    };

    const baseURL = process.env.REACT_APP_BASE_URL;
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await axios.get(`${baseURL}/accounts/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const data = response.data;
          setUserData({
            name: data.name || 'Name Surname',
            username: data.username || '@username',
            university: data.university || 'Mock University',
            specialization: data.specialization || 'Mock Specialization',
            year: data.year || '3rd year',
            password: '••••',
            email: data.email || 'mockemail@example.com',
            photo_url: data.photo_url || defaultProfilePicture,
            role: data.role || 'STUDENT',
            subject: data.subject || 'Mock Subject',
            confirmation_file: data.confirmation_file || 'mock_certificate.pdf',
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    };
  
    return (
        <div className="profile-page">
        {/* Sticky Navbar */}
        <nav className="navbar">
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">Peer-a-peer</span>
        </div>
        <div className="logout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="Log out" />
        </div>
      </nav>
        {/* Profile Section */}
        <div className="profile-container">
            <div className="profile-header">
            <img
                src={userData.photo_url}
                alt="Profile"
                className="profile-picture"
            />
            <div>
                <h1>{userData.name}</h1>
                <p className="username">{userData.username}</p>
            </div>
            </div>

            <div className="profile-details">
            <p>🏛 {userData.university}</p>
            <p>🎓 {userData.specialization}</p>
            <p>📅 {userData.year}</p>
            <p>🔒 {userData.password}</p>
            <p>✉️ {userData.email}</p>

            {userData.role === 'TUTOR' && (
                <>
                <p>📚 Subject: {userData.subject}</p>
                <p>
                    🏅 Certificate:{' '}
                    <a
                    href={`${baseURL}/files/${userData.confirmation_file}`}
                    download
                    className="certificate-link"
                    >
                    {userData.confirmation_file}
                    </a>
                </p>
                </>
            )}
            </div>
        </div>
        </div>
    );
  };
  
  export default ProfilePage;