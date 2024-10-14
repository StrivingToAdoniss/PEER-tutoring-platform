// src/components/HeroSection.js
import React from 'react';
import '../styles/HeroSection.css';  // Create this CSS for styling
import Button from './Button';
import peersSitting from '../assets/peers_sitting.svg';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
      <h1>Your Study Buddy<br /> is Just a Click Away</h1>
      <p>
        Peer Learning Platform connects you with fellow students in seconds. You can try to prepare for exams on your own, but with us, it will be much easier and more effective!
      </p>
      <Button text="Find Your Peer" onClick={() => {}} className="hero-button" />
      </div>
        <div className="hero-image">
        <img src={peersSitting} alt="Peers sitting together" />
      </div>
    </div>
  );
};

export default HeroSection;