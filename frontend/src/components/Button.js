// src/components/Button.js
import React from 'react';
import '../styles/Button.css'; // Optional: For styling the button

const Button = ({ text, onClick, type = 'black', className = '' }) => {
    return (
      <button className={`custom-button ${type}-button ${className}`} onClick={onClick}>
        {text}
      </button>
    );
  };
  
  export default Button;
