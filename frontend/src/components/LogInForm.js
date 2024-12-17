import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Axios for making HTTP requests
import '../styles/LogIn.css';
import backgroundImage from '../assets/LogIn/login_background.svg';

const baseURL = process.env.REACT_APP_BASE_URL;

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // For displaying errors
  const navigate = useNavigate();

  useEffect(() => {
    // Find the elements that need to animate
    const loginContainer = document.querySelector('.login-container');
    const loginContent = document.querySelector('.login-content');
    const cornerImage = document.querySelector('.login-page-image');

    // Add the 'visible' class after a short delay to trigger the animation
    setTimeout(() => {
      loginContainer.classList.add('visible');
      loginContent.classList.add('visible');
      cornerImage.classList.add('visible');
    }, 100);  // Adjust delay as needed
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    setError(null); // Reset any existing errors

    try {
      const response = await axios.post(`${baseURL}/accounts/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Login successful, store JWT token locally
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        navigate('/'); // Navigate to home or dashboard
      }
    } catch (error) {
      if (error.response) {
        // Extract the status code from the response
        const statusCode = error.response.status;
    
        if (statusCode === 400) {
          setError('Invalid login credentials. Please try again.');
        } else if (statusCode === 403) {
          setError('Your account is not approved by the admin yet.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        // Handle errors where no response is returned (e.g., network issues)
        setError('Unable to connect to the server. Please check your connection.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-page-image">
        <img src={backgroundImage} alt="LogIn illustration" />
      </div>
      <div className="login-content">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Log in</button>
        </form>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        <p className="signup-redirect">
          Don't have an account? <Link to="/signup">Create One!</Link>
        </p>
      </div>
    </div>
  );
};

export default LogInForm;