import React from 'react';
import MainForm from '../components/MainForm';  // Import the MainForm component
import '../styles/SignUp.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      {/* MainForm handles the entire form flow */}
      <MainForm />
    </div>
  );
};

export default SignUp;
