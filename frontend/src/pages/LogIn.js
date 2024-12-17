// src/pages/LogIn.js
import React, { useEffect } from 'react';
import LogInForm from '../components/LogInForm';  // Use the login form as a separate component
import Navbar from '../components/Navbar';
import {useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const LogIn = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/'); // Redirect to home page if logged in
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <LogInForm />  
    </>
  );
};

export default LogIn;
