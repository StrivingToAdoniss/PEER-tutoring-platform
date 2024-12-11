import React, { useState, useEffect } from 'react';
import SubjectSelector from './SubjectSelector';
import SpecializationSelector from './SpecializationSelector';
import Button from './Button';
import axios from 'axios';
import '../styles/TutorSubjectsStep.css';
import backgroundImage from '../assets/SignUp/tutor_step_4_background.svg';
import { useNavigate } from 'react-router-dom';

const colors = [
  '#FFB6C1', '#ADD8E6', '#98FB98', '#DDA0DD', '#FFD700',
  '#FF7F50', '#4682B4', '#8A2BE2', '#FFA500', '#40E0D0',
  '#6495ED', '#DC143C', '#32CD32', '#9370DB', '#FFDAB9',
  '#FF6347', '#4682B4', '#8B0000', '#FFD700', '#00CED1',
  '#DAA520', '#7FFF00', '#D2691E', '#FF4500', '#8FBC8F'
];

const MAX_SUBJECTS = 3;

const mockSubjects = ['Math', 'Physics', 'English', 'Chemistry', 'Biology'];
const mockSpecializations = {
  Math: ['Calculus', 'Algebra', 'Probability'],
  Physics: ['Mechanics', 'Optics', 'Quantum Physics'],
  English: ['British', 'American', 'IELTS Preparation'],
  Chemistry: ['Organic', 'Inorganic', 'Physical Chemistry'],
  Biology: ['Genetics', 'Ecology', 'Microbiology'],
};

const assignColor = (name, colorMap) => {
  if (colorMap[name]) return colorMap[name];

  let availableColors = colors.filter(color => !Object.values(colorMap).includes(color));
  const color = availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];
  
  colorMap[name] = color;
  return color;
};

const TutorSubjectsStep = ({ formData, onBack, onNext, onChange }) => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState({});
  const [colorMap, setColorMap] = useState({});
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const handleSubjectSelect = (subject) => {
    if (selectedSubjects.length >= MAX_SUBJECTS) {
      setError(`You can only select up to ${MAX_SUBJECTS} subjects.`);
      return;
    }
    clearError();
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setSelectedSpecializations((prev) => ({
        ...prev,
        [subject]: [],
      }));
    }
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      subjects: selectedSubjects,
      specializations: selectedSpecializations,
    };
  
    onChange(updatedFormData);
  
    // Prepare FormData
    const formDataToSubmit = new FormData();
    Object.keys(updatedFormData).forEach((key) => {
      if (key === 'subjects' || key === 'specializations') {
        // Handle array or object fields
        formDataToSubmit.append(key, JSON.stringify(updatedFormData[key]));
      } else {
        formDataToSubmit.append(key, updatedFormData[key]);
      }
    });
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/accounts/registration', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      //console.log('Registration successful:', response.data);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      setError('Failed to submit the form. Please try again.');
    }
  };
  

  const handleSubjectRemove = (subject) => {
    clearError();
    setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    setSelectedSpecializations((prev) => {
      const updatedSpecializations = { ...prev };
      delete updatedSpecializations[subject];
      return updatedSpecializations;
    });
  };

  const handleSpecializationSelect = (subject, specialization) => {
    clearError();
    setSelectedSpecializations((prev) => ({
      ...prev,
      [subject]: prev[subject].includes(specialization)
        ? prev[subject]
        : [...prev[subject], specialization],
    }));
  };

  const handleSpecializationRemove = (subject, specialization) => {
    clearError();
    setSelectedSpecializations((prev) => ({
      ...prev,
      [subject]: prev[subject].filter(s => s !== specialization),
    }));
  };

  useEffect(() => {
    const newColorMap = { ...colorMap };
    selectedSubjects.forEach((subject) => assignColor(subject, newColorMap));
    Object.keys(selectedSpecializations).forEach((subject) => {
      selectedSpecializations[subject].forEach((spec) => assignColor(spec, newColorMap));
    });
    setColorMap(newColorMap);
  }, [selectedSubjects, selectedSpecializations]);

  const availableSubjects = mockSubjects.filter(subject => !selectedSubjects.includes(subject));
  const availableSpecializations = {};
  selectedSubjects.forEach(subject => {
    availableSpecializations[subject] = mockSpecializations[subject].filter(
      spec => !selectedSpecializations[subject]?.includes(spec)
    );
  });

  const isFormComplete = selectedSubjects.length > 0 && Object.values(selectedSpecializations).every(arr => arr.length > 0);

  return (
    <div className="subject-outer-container">
      <div className="step-4-tutor-image">
        <img src={backgroundImage} alt="Tutor illustration" />
      </div>
      <div className="subject-adjusted-width-container">
        <h2>Choose the subjects you can teach</h2>
        <div className="form-section">
          <span className="side-text">Subjects:</span>
          <SubjectSelector
            availableSubjects={availableSubjects}
            selectedSubjects={selectedSubjects}
            onSelect={handleSubjectSelect}
            onRemove={handleSubjectRemove}
            colorMap={colorMap}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        {selectedSubjects.length > 0 && (
          <div className="form-section">
            <span className="side-text">Specializations:</span>
            <SpecializationSelector
              selectedSubjects={selectedSubjects}
              selectedSpecializations={selectedSpecializations}
              availableSpecializations={availableSpecializations}
              onSelectSpecialization={handleSpecializationSelect}
              onRemoveSpecialization={handleSpecializationRemove}
              colorMap={colorMap}
            />
          </div>
        )}
        
        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button
            text="Next"
            className={isFormComplete ? 'blue-button' : 'gray-button'}
            onClick={handleSubmit}
            disabled={!isFormComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default TutorSubjectsStep;
