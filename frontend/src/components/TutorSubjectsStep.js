import React, { useState } from 'react';
import Button from './Button';
import SubjectTag from './SubjectTag';
import '../styles/TutorSubjectsStep.css';

// Example mock subjects and specializations
const mockSubjects = ['English', 'Math', 'Physics', 'Chemistry'];
const mockSpecializations = {
  Math: ['Algebra', 'Calculus', 'Probability'],
  Physics: ['Quantum Mechanics', 'Classical Mechanics'],
};

const TutorSubjectsStep = ({ formData, onBack, onSubmit, onChange }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState({});

  const handleSubjectSelect = (subject) => {
    setSelectedSubjects((prev) => [...prev, subject]);
    setSelectedSpecializations((prev) => ({ ...prev, [subject]: [] }));
  };

  const handleSpecializationSelect = (subject, specialization) => {
    setSelectedSpecializations((prev) => ({
      ...prev,
      [subject]: [...prev[subject], specialization],
    }));
  };

  const handleSubjectRemove = (subject) => {
    setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    setSelectedSpecializations((prev) => {
      const newSpecs = { ...prev };
      delete newSpecs[subject];
      return newSpecs;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange({ subjects: selectedSubjects, specializations: selectedSpecializations });
    onSubmit();
  };

  return (
    <div className="tutor-subjects-step">
      <h2>Choose Subjects and Specializations</h2>
      <div className="subjects-container">
        {mockSubjects.map((subject) => (
          <SubjectTag
            key={subject}
            subject={subject}
            selected={selectedSubjects.includes(subject)}
            onSelect={() => handleSubjectSelect(subject)}
            onRemove={() => handleSubjectRemove(subject)}
          />
        ))}
      </div>

      {selectedSubjects.map((subject) => (
        <div key={subject}>
          <h4>{subject} Specializations:</h4>
          {mockSpecializations[subject].map((specialization) => (
            <SubjectTag
              key={specialization}
              subject={specialization}
              onSelect={() => handleSpecializationSelect(subject, specialization)}
            />
          ))}
        </div>
      ))}

      <div className="form-button-container">
        <Button text="Back" className="outline-button" onClick={onBack} />
        <Button text="Submit" className="blue-button" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default TutorSubjectsStep;
