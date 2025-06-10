import React, { useEffect, useState } from 'react';
import '../styles/StepProgress.css';
import EventBus from '../services/EventBus';
import { withLogger } from './withLogger';

const StepProgress = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);

  useEffect(() => {
    const unsubStep = EventBus.on('stepChange', step => {
      setCurrentStep(step);
    });
    const unsubTotal = EventBus.on('totalStepsChange', total => {
      setTotalSteps(total);
    });
    return () => {
      unsubStep();
      unsubTotal();
    };
  }, []);

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-progress">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${currentStep >= step ? 'active' : ''}`}>
            <div className="circle">{step}</div>
          </div>
          {index < totalSteps - 1 && (
            <div className={`line ${currentStep > step ? 'filled' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default withLogger(StepProgress);
