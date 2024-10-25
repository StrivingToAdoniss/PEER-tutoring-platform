import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Axios for making HTTP requests
import '../styles/LogIn.css';
import backgroundImage from '../assets/LogIn/login_background.svg';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // For displaying errors
  const navigate = useNavigate();

  useEffect(() => {
    // Find the elements that need to animate
    const loginContainer = document.querySelector('.login-container');
    const loginContent = document.querySelector('.login-content');
    const cornerImage = document.querySelector('.corner-image');

    // Add the 'visible' class after a short delay to trigger the animation
    setTimeout(() => {
      loginContainer.classList.add('visible');
      loginContent.classList.add('visible');
      cornerImage.classList.add('visible');
    }, 100);  // Adjust delay as needed
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent page reload
    setError(null);  // Reset any existing errors

    try {
      // Make the POST request to the backend with email and password
      const response = await axios.post('http://your-backend-url.com/api/login/', {
        email,
        password
      });

      // If successful, navigate to the home page or dashboard
      if (response.status === 200) {
        navigate('/');
      } else {
        setError('Invalid login credentials');
      }
    } catch (error) {
      setError('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
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
      {/* Add the image in the lower-left corner */}
      <img src={backgroundImage} alt="Background Illustration" className="corner-image" />
    </div>
  );
};

export default LogInForm;