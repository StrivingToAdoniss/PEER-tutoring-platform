// StudentForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import '../styles/StudentForm.css';
import backgroundImage from '../assets/SignUp/singup_student_background_step_2.svg';

const StudentForm = ({ onSubmit, onBack, initialFormData }) => {
  useEffect(() => {
    const studentForm = document.querySelector('.student-form');
    const buttonContainer = document.querySelector('.form-button-container');
    setTimeout(() => {
      studentForm.classList.add('visible');
      buttonContainer.classList.add('visible');
    }, 100);
  }, []);

  const [formData, setFormData] = useState(
    initialFormData || {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      role: 'STUDENT', // Set default role as 'STUDENT'
    }
  );

  const [errors, setErrors] = useState({});

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for password and username
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    const usernamePattern = /^.{4,}$/;

    const validationErrors = {};

    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        'Password must be at least 4 characters long, contain at least one uppercase letter and one special character.';
    }

    if (!usernamePattern.test(formData.username)) {
      validationErrors.username = 'Username must be at least 8 characters long.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      // Store the JWT tokens
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Set the default authorization header for Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Proceed to the next step or redirect as needed
      onSubmit(formData);
    } catch (error) {
      // Handle errors returned by the server
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('Registration error:', error);
      }
    }
  };

  // Check if the form is complete
  const isFormComplete = Object.values(formData).every((value) => value !== '');

  return (
    <div className="student-form-container">
      {/* Image Section */}
      <div className="student-image">
        <img src={backgroundImage} alt="Student illustration" />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.first_name && <p className="error-message">{errors.first_name}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
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
        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button
            text="Register"
            className={isFormComplete ? 'blue-button' : 'gray-button'}
            disabled={!isFormComplete}
          />
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
