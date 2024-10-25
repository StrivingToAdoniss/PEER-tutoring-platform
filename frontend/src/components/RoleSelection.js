// src/components/RoleSelection.js
import React from 'react';
import Button from './Button';
import studentImage from '../assets/SignUp/student_image.svg'; // Add your student image
import teacherImage from '../assets/SignUp/teacher_image.svg'; // Add your teacher image
import '../styles/RoleSelection.css'; // Custom styles for this component

const RoleSelection = ({ onSelectRole }) => {
  return (
    <div className="role-selection">
      <h2>Choose a role:</h2>
      <div className="role-options">
        <div className="role-card" onClick={() => onSelectRole('Student')}>
          <img src={studentImage} alt="Student" />
          <h3>Student</h3>
        </div>
        <div className="role-card" onClick={() => onSelectRole('Teacher')}>
          <img src={teacherImage} alt="Teacher" />
          <h3>Teacher</h3>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
