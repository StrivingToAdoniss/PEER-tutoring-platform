import React, { useEffect } from 'react';
import studentImage from '../assets/SignUp/student_image.svg'; // Add your student image
import teacherImage from '../assets/SignUp/teacher_image.svg'; // Add your teacher image
import '../styles/RoleSelection.css'; // Custom styles for this component

const RoleSelection = ({ onSelectRole }) => {

  useEffect(() => {
    const roleSelection = document.querySelector('.role-selection');
    const roleOptions = document.querySelector('.role-selection-options');
    setTimeout(() => {
      roleSelection.classList.add('visible');
      roleOptions.classList.add('visible');
    }, 100);
  }, []);

  return (
    <div className="role-selection">
      <h2>Select Your Role</h2>
      <div className="role-selection-options">
        <div className="role-selection-card" onClick={() => onSelectRole('Student')}>
          <img src={studentImage} alt="Student" />
          <h3>Student</h3>
        </div>
        <div className="role-selection-card" onClick={() => onSelectRole('Tutor')}>
          <img src={teacherImage} alt="Tutor" />
          <h3>Tutor</h3>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
