// src/components/TutorFormStep.js
import React, { useState, useEffect } from 'react';
import Button from './Button';
import '../styles/TutorFormStep.css';
import backgroundTutorImage from '../assets/SignUp/tutor_step_2_background.svg';
import { withLogger } from './withLogger';

const TutorFormStep = ({ initialFormData, onBack, onNext, onChange }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{4,}$/;
    const usernamePattern = /^.{4,}$/;
    const validationErrors = {};

    if (!passwordPattern.test(initialFormData.password)) {
      validationErrors.password =
        'Password must be at least 4 characters long, contain at least one uppercase letter and one special character.';
    }
    if (!usernamePattern.test(initialFormData.username)) {
      validationErrors.username = 'Username must be at least 4 characters long.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      onNext();
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        console.error('Registration error:', err);
      }
    }
  };

  const requiredFields = ['first_name', 'last_name', 'email', 'username', 'password'];
  const isFormComplete = requiredFields.every(
    (field) => initialFormData[field] && initialFormData[field].trim() !== ''
  );

  useEffect(() => {
    // Optionally add side-effects or animations here
  }, []);

  return (
    <div className="tutor-form-step">
      <div className="background-tutor-image">
        <img src={backgroundTutorImage} alt="Tutor illustration" />
      </div>
      <form onSubmit={handleSubmit} className="tutor-form">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={initialFormData.first_name}
          onChange={handleChange}
          required
        />
        {errors.first_name && <p className="error-message">{errors.first_name}</p>}

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={initialFormData.last_name}
          onChange={handleChange}
          required
        />
        {errors.last_name && <p className="error-message">{errors.last_name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={initialFormData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={initialFormData.username}
          onChange={handleChange}
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={initialFormData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <div className="tutor-form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button text="Next" className={isFormComplete ? 'blue-button' : 'gray-button'} />
        </div>
      </form>
    </div>
  );
};

export default withLogger(TutorFormStep);
