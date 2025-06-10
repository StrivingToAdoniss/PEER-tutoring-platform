import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiFacade from '../services/ApiFacade';
import { withLogger } from './withLogger';
import '../styles/LogIn.css';
import backgroundImage from '../assets/LogIn/login_background.svg';

const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loginContainer = document.querySelector('.login-container');
    const loginContent = document.querySelector('.login-content');
    const cornerImage = document.querySelector('.login-page-image');

    setTimeout(() => {
      loginContainer.classList.add('visible');
      loginContent.classList.add('visible');
      cornerImage.classList.add('visible');
    }, 100);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await ApiFacade.login({ email, password });
      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);
      navigate('/');
    } catch (err) {
      if (err.response) {
        const statusCode = err.response.status;
        if (statusCode === 400) {
          setError('Invalid login credentials. Please try again.');
        } else if (statusCode === 403) {
          setError('Your account is not approved by the admin yet.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
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
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-redirect">
          Don't have an account? <Link to="/signup">Create One!</Link>
        </p>
      </div>
    </div>
  );
};

export default withLogger(LogInForm);
