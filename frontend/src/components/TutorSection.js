import React, { useState, useEffect } from 'react';
import '../styles/TutorSection.css';
import Button from './Button';
import FilterBox from './FilterBox';

// Import icons and images
import mockTutor1 from '../assets/mock_tutor_1.jpg';
import mockTutor2 from '../assets/mock_tutor_2.jpg';
import iconSubject from '../assets/icon_subject.svg';
import iconUniversity from '../assets/icon_university.svg';
import iconLanguage from '../assets/icon_language.svg';
import iconLocation from '../assets/icon_location.svg';
import iconRating from '../assets/icon_rating.svg';
import iconPrice from '../assets/icon_price.svg';

// Mock list of tutors with photos
const tutors = [
  {
    name: 'Andrii Pupkin',
    subject: 'Physics',
    rating: 5,
    price: '30€',
    response: 1,
    lessonDuration: '50 min',
    bio: `An experienced, knowledgeable teacher will help you learn physics, study theory, learn to solve problems, think, analyze and draw conclusions. I work as a teacher of physics and computer science, I have 30 years of teaching experience, I have my own developments that are posted on various educational sites, I undergo annual training both in my specialty and in pedagogy and psychology.`,
    location: 'Only online',
    university: 'Université catholique de Louvain',
    year: '3rd year',
    languages: 'English C1, German B2, Ukrainian C1',
    photo: mockTutor1,
  },
  {
    name: 'Ihor Myshyk',
    subject: 'Physics',
    rating: 4.9,
    price: '50€',
    response: 10,
    lessonDuration: '30 min',
    bio: `Tutor for mathematics, physics, school, admission to university — Deep and accessible presentation of material, enthusiasm, optimism, block system, emphasis on practice, taking into account the psychological characteristics of the student. I have 16 years in educational institutions - school, lyceum, gymnasium, and 12 years - tutoring.`,
    location: 'Brussels, online',
    university: 'Universiteit Gent',
    year: '3rd year',
    languages: 'English',
    photo: mockTutor2,
  },
];

const TutorSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 10;
  const [filteredTutors, setFilteredTutors] = useState(tutors);

  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (filters) => {
    console.log('Filters:', filters);
    // Implement filtering logic here
  };

  useEffect(() => {
    // Find the elements that need to animate
    const tutorSection = document.querySelector('.tutor-section');
    const tutorCards = document.querySelectorAll('.tutor-card');

    // Add the 'visible' class after a short delay to trigger the animation
    setTimeout(() => {
      tutorSection.classList.add('visible');
      tutorCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100); // Stagger the animations
      });
    }, 100); // Adjust delay as needed
  }, []);

  return (
    <div className="tutor-section">
      <FilterBox
        subjects={['Physics', 'Math', 'Computer Science']}
        locations={['Kyiv', 'Lviv']}
        universities={[
          'Université catholique de Louvain',
          'Universiteit Gent',
          'Kyiv Polytechnic Institute',
        ]}
        priceRange={[1, 50]}
        currencyCode="€"
        onFilterChange={handleFilterChange}
      />

      {currentTutors.map((tutor, index) => (
        <div key={tutor.name} className="tutor-card">
          <div className="tutor-photo-container">
            <img src={tutor.photo} alt={tutor.name} className="tutor-photo" />
          </div>
          <div className="tutor-info">
            <h3>
              <a href={`/tutor/${tutor.name}`}>{tutor.name}</a>
            </h3>
            <p>
              <img src={iconSubject} alt="Subject" /> {tutor.subject}
            </p>
            <p>
              <img src={iconUniversity} alt="University" /> {tutor.university}{' '}
              <b>{tutor.year}</b>
            </p>
            <p>
              <img src={iconLanguage} alt="Languages" /> {tutor.languages}
            </p>
            <p>
              <img src={iconLocation} alt="Location" /> {tutor.location}
            </p>
            <p className="tutor-bio">{tutor.bio}</p>
          </div>
          <div className="tutor-meta">
            <div className="rating-price">
              <div className="rating">
                <img src={iconRating} alt="Rating Icon" />
                <div className="rating-text">
                  <span className="big-text">{tutor.rating}</span>
                  <span className="small-text">({tutor.response} resp)</span>
                </div>
              </div>
              <div className="price">
                <img src={iconPrice} alt="Price Icon" />
                <div className="price-text">
                  <span className="big-text">{tutor.price}</span>
                  <span className="small-text">{tutor.lessonDuration} lesson</span>
                </div>
              </div>
            </div>
            <div className="tutor-buttons">
              <Button
                text="CONTACT"
                className="blue-button"
                onClick={() => alert(`Contacting ${tutor.name}`)}
              />
              <Button
                text="LEARN MORE"
                className="blue-outline-button"
                onClick={() => (window.location.href = `/tutor/${tutor.name}`)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          ←
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastTutor >= filteredTutors.length}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default TutorSection;
