import React, { useState, useEffect } from 'react';
import Button from './Button';
import '../styles/TutorFormStep.css';
import backgroundTutorImage from '../assets/SignUp/tutor_step_2_background.svg';

const TutorFormStep = ({ initialFormData, onBack, onNext, onChange }) => {

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData); // Update local state
    onChange && onChange(updatedData); // Propagate changes to parent if needed
  };



  const [formData, setFormData] = useState(
    initialFormData || {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      role: 'TUTOR',
    }
  );

  

 const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{4,}$/;
    const usernamePattern = /^.{4,}$/;

    const validationErrors = {};

    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        'Password must be at least 4 characters long, contain at least one uppercase letter and one special character.';
    }

    if (!usernamePattern.test(formData.username)) {
      validationErrors.username = 'Username must be at least 4 characters long.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Create a FormData object and append fields
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('first_name', formData.first_name);
      formDataToSubmit.append('last_name', formData.last_name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('username', formData.username);
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('role', formData.role);

      onNext();

    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('Registration error:', error);
      }
    }
};

  const isFormComplete = Object.values(formData).every(
    (value) => typeof value === 'string' && value.trim() !== ''
  );

  console.log('formData:', formData);
  console.log('isFormComplete:', isFormComplete);

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
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {errors.first_name && <p className="error-message">{errors.first_name}</p>}

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {errors.last_name && <p className="error-message">{errors.last_name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error-message">{errors.username}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}

        {/* Button Container */}
          <div className="tutor-form-button-container">
            <Button text="Back" className="outline-button" onClick={onBack} />
            <Button text="Next" className={isFormComplete ? 'blue-button' : 'gray-button'} />
          </div>
      </form>
    </div>
  );
};

export default TutorFormStep;
