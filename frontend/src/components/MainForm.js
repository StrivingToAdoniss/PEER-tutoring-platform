// src/components/MainForm.js
import React, { useState } from 'react';
import StepProgress from './StepProgress';
import RoleSelection from './RoleSelection';
import StudentForm from './StudentForm';
import TutorFormStep from './TutorFormStep';
import TutorUniversityStep from './TutorUniversityStep';
import TutorSubjectsStep from './TutorSubjectsStep';
import '../styles/MainForm.css';  // Importing the CSS for MainForm

const MainForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState(null); // Track selected role
  const [totalSteps, setTotalSteps] = useState(2); // Default to StudentForm steps
  const [formData, setFormData] = useState({
    // Common fields
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    university: '',
    specialization: '',
    current_grade: '',
    role: '',
    photo_url: null,             // For file uploads
    confirmation_file: null,           // For file uploads
    //subjects: [],
    //specializations: {},
    subject: '',
  });

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Tutor') {
      setTotalSteps(4); // Tutor form has 4 steps
    } else {
      setTotalSteps(2); // Student form has 2 steps
    }
    handleNextStep(); // Move to next step after selecting a role
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormDataChange = (newData) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
  
      for (const key in newData) {
        if (
          typeof newData[key] === 'object' &&
          !Array.isArray(newData[key]) &&
          newData[key] !== null
        ) {
          // Merge nested objects
          updatedData[key] = { ...prevData[key], ...newData[key] };
        } else {
          // Update or add new fields
          updatedData[key] = newData[key];
        }
      }
  
      return updatedData;
    });
  };

  const handleSubmit = () => {
    //console.log('Form submitted!', formData);
    // Handle form submission logic here
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection
            onSelectRole={handleRoleSelection}
          />
        );
      case 2:
        if (role === 'Student') {
          formData.role = 'STUDENT'
          //console.log("Showing Studen page");

          return (
            <StudentForm
            initialFormData={formData}
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              onChange={handleFormDataChange}
            />
          );
        } else if (role === 'Tutor') {
          formData.role = 'TUTOR'
          //console.log("Showing Tutor page");
          return (
            <TutorFormStep
            initialFormData={formData}
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              onChange={handleFormDataChange}
            />
          );
        }
        break;
      case 3:
        if (role === 'Tutor') {
          return (
            <TutorUniversityStep
            initialFormData={formData}
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              onChange={handleFormDataChange}
            />
          );
        }
        break;
      case 4:
        if (role === 'Tutor') {
          return (
            <TutorSubjectsStep
              formData={formData}
              onBack={handlePreviousStep}
              onSubmit={handleSubmit}
              onChange={handleFormDataChange}
            />
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="main-form-container">
      {/* StepProgress will always be at the top */}
      <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Render form content below StepProgress */}
      {renderStepContent()}
    </div>
  );
};

export default MainForm;
