import React, { useState, useEffect } from "react";
import SelectorFactory     from "./SelectorFactory";
import StudentForm         from "./StudentForm";
import TutorFormStep       from "./TutorFormStep";
import TutorUniversityStep from "./TutorUniversityStep";
import TutorSubjectsStep   from "./TutorSubjectsStep";
import StepProgress        from "./StepProgress";
import EventBus            from "../services/EventBus";
import "../styles/MainForm.css";

const MainForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole]               = useState(null);
  const [totalSteps, setTotalSteps]   = useState(2);
  const [formData, setFormData]       = useState({
    first_name: "", last_name: "", email: "", username: "", password: "",
    university: "", specialization: "", current_grade: "", role: "",
    photo_url: null, confirmation_file: null, subject: "",
  });

  useEffect(() => {
    EventBus.emit('stepChange', currentStep);
  }, [currentStep]);

  useEffect(() => {
    EventBus.emit('totalStepsChange', totalSteps);
  }, [totalSteps]);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    const newTotal = selectedRole === "Tutor" ? 3 : 2;
    setTotalSteps(newTotal);
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormDataChange = (newData) => {
    setFormData(prev => {
      const updated = { ...prev };
      for (const key in newData) {
        if (newData[key] instanceof File) {
          updated[key] = newData[key];
        } else if (
          typeof newData[key] === "object" &&
          !Array.isArray(newData[key]) &&
          newData[key] !== null
        ) {
          updated[key] = { ...prev[key], ...newData[key] };
        } else {
          updated[key] = newData[key];
        }
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    // submission logic
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectorFactory
            type="role"
            onSelectRole={handleRoleSelection}
          />
        );
      case 2:
        formData.role = role === "Tutor" ? "TUTOR" : "STUDENT";
        if (role === "Student") {
          return (
            <StudentForm
              initialFormData={formData}
              onBack={handlePreviousStep}
              onNext={handleNextStep}
              onChange={handleFormDataChange}
            />
          );
        } else if (role === "Tutor") {
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
        if (role === "Tutor") {
          formData.role = "TUTOR";
          return (
            <TutorUniversityStep
              initialFormData={formData}
              onBack={handlePreviousStep}
              onSubmit={handleSubmit}
              onChange={handleFormDataChange}
            />
          );
        }
        break;
      case 4:
        if (role === "Tutor") {
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
      <StepProgress />
      {renderStepContent()}
    </div>
  );
};

export default MainForm;
