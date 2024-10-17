// src/pages/Home.js
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TutorSection from '../components/TutorSection';

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TutorSection />
    </>
  );
};

export default Home;
