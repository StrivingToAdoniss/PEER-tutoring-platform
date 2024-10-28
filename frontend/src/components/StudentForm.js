import React, { useState, useEffect } from 'react';
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

  const [formData, setFormData] = useState(initialFormData || {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormComplete = Object.values(formData).every(value => value !== '');

  return (
    <div className="student-form-container">
      {/* Image Section */}
      <div className="student-image">
        <img src={backgroundImage} alt="Student illustration" />
      </div>

      {/* Form Section */}
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="student-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

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
          <Button text="Next" className={isFormComplete ? 'blue-button' : 'gray-button'} />
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
