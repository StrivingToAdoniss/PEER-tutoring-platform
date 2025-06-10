import React, { useState, useEffect } from 'react';
import ApiFacade from '../services/ApiFacade';
import Button from './Button';
import { withLogger } from './withLogger';
import '../styles/StudentForm.css';
import backgroundImage from '../assets/SignUp/singup_student_background_step_2.svg';
import { useNavigate } from 'react-router-dom';

const StudentForm = ({ onSubmit, onBack, initialFormData, onChange }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const studentForm = document.querySelector('.student-form');
    const buttonContainer = document.querySelector('.form-button-container');
    setTimeout(() => {
      studentForm.classList.add('visible');
      buttonContainer.classList.add('visible');
    }, 100);
  }, []);

  const universities = ['KU Leuven', 'Ghent University'];
  const specialties = ['Math', 'Physics'];
  const courseNumbers = ['1', '2', '3', '4'];

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
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('first_name', initialFormData.first_name);
      formDataToSubmit.append('last_name', initialFormData.last_name);
      formDataToSubmit.append('university', initialFormData.university);
      formDataToSubmit.append('specialization', initialFormData.specialization);
      formDataToSubmit.append('current_grade', initialFormData.current_grade);
      formDataToSubmit.append('email', initialFormData.email);
      formDataToSubmit.append('username', initialFormData.username);
      formDataToSubmit.append('password', initialFormData.password);
      formDataToSubmit.append('role', initialFormData.role);

      await ApiFacade.registerUser(formDataToSubmit);
      navigate('/login');
      onSubmit(initialFormData);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        console.error('Registration error:', err);
      }
    }
  };

  const requiredFields = [
    'first_name',
    'last_name',
    'email',
    'username',
    'password',
    'specialization',
    'university',
    'current_grade',
  ];

  const isFormComplete = requiredFields.every(
    (field) => initialFormData[field] && initialFormData[field].trim() !== ''
  );

  return (
    <div className="student-form-container">
      <div className="student-image">
        <img src={backgroundImage} alt="Student illustration" />
      </div>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-columns">
          <div className="form-column">
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

            <select
              name="university"
              value={initialFormData.university}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select University
              </option>
              {universities.map((uni, index) => (
                <option key={index} value={uni}>
                  {uni}
                </option>
              ))}
            </select>

            <select
              name="current_grade"
              value={initialFormData.current_grade}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Grade
              </option>
              {courseNumbers.map((grade, index) => (
                <option key={index} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
          <div className="form-column">
            <select
              name="specialization"
              value={initialFormData.specialization}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Specialty
              </option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

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
          </div>
        </div>
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

export default withLogger(StudentForm);
