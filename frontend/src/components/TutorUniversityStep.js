import React from 'react';
import Button from './Button';
import '../styles/TutorUniversityStep.css';

const TutorUniversityStep = ({ formData, onBack, onNext, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ education: { ...formData.education, [name]: value } });
  };

  const handleFileChange = (e) => {
    onChange({ [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="tutor-university-step">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="institute"
          placeholder="Institute"
          value={formData.education.institute}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="specialty"
          placeholder="Specialty"
          value={formData.education.specialty}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="courseNumber"
          placeholder="Course Number"
          value={formData.education.courseNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="profilePhoto"
          onChange={handleFileChange}
        />
        <input
          type="file"
          name="certifications"
          onChange={handleFileChange}
        />

        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button text="Next" className="gray-button" />
        </div>
      </form>
    </div>
  );
};

export default TutorUniversityStep;
