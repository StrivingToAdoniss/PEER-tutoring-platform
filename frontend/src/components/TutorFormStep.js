import React from 'react';
import Button from './Button';
import '../styles/TutorFormStep.css';
import backgroundImage from '../assets/SignUp/tutor_step_2_background.svg';

const TutorFormStep = ({ formData, onBack, onNext, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password'];
  const isFormComplete = requiredFields.every((field) => formData[field] !== '');  

  return (
    <div className="tutor-form-step">
      <div className="background-tutor-image">
        <img src={backgroundImage} alt="Tutor illustration" />
      </div>
      <form onSubmit={handleSubmit} className="tutor-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
                <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {/* Button Container */}
        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button text="Next" className={isFormComplete ? 'blue-button' : 'gray-button'} />
        </div>
      </form>
    </div>
  );
};

export default TutorFormStep;
