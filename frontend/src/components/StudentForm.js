import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import '../styles/StudentForm.css';
import backgroundImage from '../assets/SignUp/singup_student_background_step_2.svg';
import { useNavigate } from 'react-router-dom';

const StudentForm = ({ onSubmit, onBack, initialFormData, onChange }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const studentForm = document.querySelector('.student-form');
    const buttonContainer = document.querySelector('.form-button-container');
    setTimeout(() => {
      studentForm.classList.add('visible');
      buttonContainer.classList.add('visible');
    }, 100);
  }, []);

  const universities = ["KU Leuven", "Ghent University"];
  const specialties = ["Math", "Physics"];
  const courseNumbers = ["1", "2", "3", "4"];

  const [formData, setFormData] = useState(
    initialFormData || {
      first_name: '',
      last_name: '',
      university: '',
      specialization: '',
      current_grade: '',
      email: '',
      username: '',
      password: '',
      role: 'STUDENT',
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (onChange) {
      onChange({ [name]: value });
    }
  };

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
    formDataToSubmit.append('university', formData.university);
    formDataToSubmit.append('specialization', formData.specialization);
    formDataToSubmit.append('current_grade', formData.current_grade);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('username', formData.username);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('role', formData.role);

    // Send the FormData object
    const response = await axios.post(
      'http://127.0.0.1:8000/api/v1/accounts/registration',
      formDataToSubmit,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Submitting form data:', formDataToSubmit);
    console.log('Current response status: ', response.status);

    if(response.status === 201){
      console.log('Registration successful:', response.data);
      navigate('/login');
      onSubmit(formData);

    }

  } catch (error) {
    if (error.response && error.response.data) {
      setErrors(error.response.data);
    } else {
      console.error('Registration error:', error);
    }
  }
};
  const isFormComplete = Object.values(formData).every((value) => value.trim() !== '');

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

            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select University
              </option>
              {universities.map((university, index) => (
                <option key={index} value={university}>
                  {university}
                </option>
              ))}
            </select>

            <select
              name="current_grade"
              value={formData.current_grade}
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
              value={formData.specialization}
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

export default StudentForm;
