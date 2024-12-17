import React, { useEffect } from 'react';
import MainForm from '../components/MainForm';  // Import the MainForm component
import '../styles/SignUp.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const SignUp = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/'); // Redirect to home page if logged in
    }
  }, [navigate]);

  return (
    <div className="signup-container">
      {/* MainForm handles the entire form flow */}
      <Navbar />
      <MainForm />
    </div>
  );
};

export default SignUp;
