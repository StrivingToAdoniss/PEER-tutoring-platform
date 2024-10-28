import React from 'react';
import '../styles/StepProgress.css'; // Custom styles for the step progress

const StepProgress = ({ currentStep, totalSteps }) => {
  // Create an array with the number of steps
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-progress">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${currentStep >= step ? 'active' : ''}`}>
            <div className="circle">{step}</div>
          </div>
          {/* Add a line between the steps, but not after the last step */}
          {index < totalSteps - 1 && (
            <div className={`line ${currentStep > step ? 'filled' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepProgress;
