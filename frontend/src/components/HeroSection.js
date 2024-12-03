
import React, { useEffect } from 'react';
import '../styles/HeroSection.css'; 
import Button from './Button';
import peersSitting from '../assets/HeroSection/peers_sitting.svg';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Find the elements that need to animate
    const heroContainer = document.querySelector('.hero-container');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    setTimeout(() => {
      heroContainer.classList.add('visible');
      heroContent.classList.add('visible');
      heroImage.classList.add('visible');
    }, 100);  // Adjust delay as needed
  }, []);

  return (
    <div className="hero-container">
      <div className="hero-content">
      <h1>Your Study Buddy<br /> is Just a Click Away</h1>
      <p>
        Peer Learning Platform connects you with fellow students in seconds. You can try to prepare for exams on your own, but with us, it will be much easier and more effective!
      </p>
      <Button text="Find Your Peer" onClick={() => navigate('/login')} className="hero-button" />

      </div>
        <div className="hero-image">
        <img src={peersSitting} alt="Peers sitting together" />
      </div>
    </div>
  );
};

export default HeroSection;