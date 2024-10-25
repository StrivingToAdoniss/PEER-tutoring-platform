// src/pages/SignUp.js
import React, { useState } from 'react';
import RoleSelection from '../components/RoleSelection';
import StudentForm from '../components/StudentForm';
import Button from '../components/Button'; // Import Button component
import '../styles/SignUp.css';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState(''); // Track selected role
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
  });

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleRoleSelection = (role) => {
    setUserRole(role);
    nextStep();
  };

  const handleStudentFormSubmit = (data) => {
    setStudentData({ ...studentData, ...data });
    nextStep();
  };

  const isFormComplete = () => {
    const { firstName, lastName, email, password, phoneNumber, dateOfBirth } = studentData;
    return firstName && lastName && email && password && phoneNumber && dateOfBirth;
  };

  return (
    <div className="signup-container">
      {currentStep === 1 && <RoleSelection onSelectRole={handleRoleSelection} />}
      
      {currentStep === 2 && userRole === 'Student' && (
        <StudentForm onSubmit={handleStudentFormSubmit} onBack={prevStep} />
      )}
    </div>
  );
};

export default SignUp;
