// StudentForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import '../styles/StudentForm.css';
import backgroundImage from '../assets/SignUp/singup_student_background_step_2.svg';

const StudentForm = ({ onSubmit, onBack, initialFormData, onChange }) => {
  useEffect(() => {
    const studentForm = document.querySelector('.student-form');
    const buttonContainer = document.querySelector('.form-button-container');
    setTimeout(() => {
      studentForm.classList.add('visible');
      buttonContainer.classList.add('visible');
    }, 100);
  }, []);

  const institutes = [
    "KU Leuven",
    "Ghent University",
    "Wageningen University and Research",
    "Aarhus University",
    "Uppsala University",
    "UCLouvain",
    "Institute for European Studies - Université libre de Bruxelles",
    "University of Antwerp",
    "MIP Politecnico Di Milano",
    "Vrije Universiteit Brussel (VUB)",
    "University of Liège",
    "University of Kent",
    "Politecnico di Torino",
    "Hasselt University",
    "University of Luxembourg",
    "Université de Mons",
    "University of Salzburg",
    "University of Namur",
    "Institute of Tropical Medicine Antwerp (ITM)",
    "GEM Stones",
    "Haute Ecole Charlemagne",
    "Brussels School of Governance",
    "VIVES University of Applied Sciences",
    "Evangelische Theologische Faculteit (ETF)",
    "LUCA School of Arts - Campus Sint-Lucas Brussels",
    "IAD - Institut des Arts de Diffusion",
    "Catholic University College of Bruges-Ostend",
    "ESRA International Film School",
    "Lerian-Nti",
    "EU-Japan Centre for Industrial Cooperation",
    "Flemish Interuniversity Council - University Development Cooperation (VLIR-UOS)",
    "FWO: Fonds Wetenschappelijk Onderzoek - Vlaanderen",
    "GLOBIS University",
    "Université UCLouvain Saint-Louis Bruxelles",
    "The United Nations University Institute on Comparative Regional Integration Studies (UNU-CRIS)",
    "Thomas More",
    "UC Leuven-Limburg",
    "The Haute École de Namur-Liège-Luxembourg",
    "The International School of Protocol & Diplomacy ISPD",
    "Artevelde University of Applied Sciences",
    "Howest University of Applied Sciences",
    "Haute Ecole Libre Mosane",
    "United International Business Schools",
    "Odisee University",
    "Utrecht Summer School",
    "Entrepreneurship School",
    "EIT Food",
    "ECS European Communication School Brussels",
    "ICHEC Brussels Management School",
    "EUREC - The Association of European Renewable Energy Research Centres",
    "College of Europe",
    "EIT Urban Mobility Master School",
    "UBI Business School",
    "Antwerp Management School",
    "Vlerick Business School",
    "IHECS FORMATIONS - Journalism & Communication",
    "Solvay Brussels School of Economics and Management",
    "EIT RawMaterials Academy",
    "InnoEnergy MastersPlus",
    "Centre international de formation européenne - CIFE",
    "Swiss School Of Business and Management",
    "KdG University of Applied Sciences and Arts",
    "Global Institute of Sport",
    "HEH - Haute Ecole de la Communauté française en Hainaut",
    "Wallonie-Bruxelles International (WBI)",
    "European Desk - Belgian-Italian Chamber of Commerce",
    "EIT Digital Professional School",
    "iSE The Institute of Sustainable Energy by InnoEnergy",
    "Royal Military Academy",
    "Haute Ecole de Namur",
    "Artesis Plantijn University of Applied Sciences and Arts Antwerp",
    "Belgium Directorate-General for Development Cooperation",
    "Alliance française de Bruxelles-Europe",
    "European Public Health Master",
    "The European Heart Academy",
    "Cours Florent School",
    "Erasmus Brussels University of Applied Sciences and Arts",
    "IPE Management School Paris",
    "Haute École Albert Jacquard"
  ];
  const specialties = ["Specialty X", "Specialty Y", "Specialty Z"];
  const courseNumbers = ["1", "2", "3", "4"];

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onChange({
      education: { [name]: value },
    });
  };

  const [formData, setFormData] = useState(
    initialFormData || {
      firstName: '',
      lastName: '',
      institute: '',
      specialty: '',
      courseNumber: '',
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
      console.log('yay')
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        institute: formData.institute,
        specialty: formData.specialty,
        education: formData.education,
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
      <div className="form-columns">
        <div className="form-column">
          {/* First column fields */}
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

          <select
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            required
            className={!formData.institute ? 'select-placeholder' : ''}
          >
            <option value="" disabled>Select University</option>
            {institutes.map((institute, index) => (
              <option key={index} value={institute}>
                {institute}
              </option>
            ))}
          </select>

          <select
            name="courseNumber"
            value={formData.courseNumber}
            onChange={handleChange}
            required
            className={!formData.courseNumber ? 'select-placeholder' : ''}
          >
            <option value="" disabled>Select Course Number</option>
            {courseNumbers.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="form-column">
          {/* Second column fields */}
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            className={!formData.specialty ? 'select-placeholder' : ''}
          >
            <option value="" disabled>Select Specialty</option>
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
