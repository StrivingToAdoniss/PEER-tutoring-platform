import React, { useState, useEffect } from "react";
import SelectorFactory from "./SelectorFactory";
import Button from "./Button";
import ApiFacade from "../services/ApiFacade";
import { withLogger } from "./withLogger";
import "../styles/TutorSubjectsStep.css";
import backgroundImage from "../assets/SignUp/tutor_step_4_background.svg";
import { useNavigate } from "react-router-dom";

const colors = [
  "#FFB6C1", "#ADD8E6", "#98FB98", "#DDA0DD", "#FFD700",
  "#FF7F50", "#4682B4", "#8A2BE2", "#FFA500", "#40E0D0",
  "#6495ED", "#DC143C", "#32CD32", "#9370DB", "#FFDAB9",
  "#FF6347", "#4682B4", "#8B0000", "#FFD700", "#00CED1",
  "#DAA520", "#7FFF00", "#D2691E", "#FF4500", "#8FBC8F"
];

const MAX_SUBJECTS = 3;
const mockSubjects = ["Math", "Physics", "English", "Chemistry", "Biology"];
const mockSpecializations = {
  Math: ["Calculus", "Algebra", "Probability"],
  Physics: ["Mechanics", "Optics", "Quantum Physics"],
  English: ["British", "American", "IELTS Preparation"],
  Chemistry: ["Organic", "Inorganic", "Physical Chemistry"],
  Biology: ["Genetics", "Ecology", "Microbiology"],
};

const assignColor = (name, colorMap) => {
  if (colorMap[name]) return colorMap[name];
  const available = colors.filter((c) => !Object.values(colorMap).includes(c));
  const color = available.length ? available[0] : colors[Math.floor(Math.random() * colors.length)];
  colorMap[name] = color;
  return color;
};

const TutorSubjectsStep = ({ formData, onBack, onChange }) => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState({});
  const [colorMap, setColorMap] = useState({});
  const [error, setError] = useState("");

  const clearError = () => setError("");

  const handleSubjectSelect = (subject) => {
    if (selectedSubjects.length >= MAX_SUBJECTS) {
      setError(`You can only select up to ${MAX_SUBJECTS} subjects.`);
      return;
    }
    clearError();
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setSelectedSpecializations((prev) => ({
        ...prev,
        [subject]: [],
      }));
    }
  };

  const handleSubjectRemove = (subject) => {
    clearError();
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    setSelectedSpecializations((prev) => {
      const updated = { ...prev };
      delete updated[subject];
      return updated;
    });
  };

  const handleSpecializationSelect = (subject, spec) => {
    clearError();
    setSelectedSpecializations((prev) => ({
      ...prev,
      [subject]: prev[subject].includes(spec)
        ? prev[subject]
        : [...prev[subject], spec],
    }));
  };

  const handleSpecializationRemove = (subject, spec) => {
    clearError();
    setSelectedSpecializations((prev) => ({
      ...prev,
      [subject]: prev[subject].filter((s) => s !== spec),
    }));
  };

  useEffect(() => {
    const newMap = { ...colorMap };
    selectedSubjects.forEach((subj) => assignColor(subj, newMap));
    Object.entries(selectedSpecializations).forEach(([subj, specs]) => {
      specs.forEach((spec) => assignColor(spec, newMap));
    });
    setColorMap(newMap);
  }, [selectedSubjects, selectedSpecializations]);

  const availableSubjects = mockSubjects.filter((s) => !selectedSubjects.includes(s));
  const availableSpecializations = {};
  selectedSubjects.forEach((subj) => {
    availableSpecializations[subj] = mockSpecializations[subj].filter(
      (spec) => !selectedSpecializations[subj]?.includes(spec)
    );
  });

  const isFormComplete =
    selectedSubjects.length > 0 &&
    Object.values(selectedSpecializations).every((arr) => arr.length > 0);

  const handleSubmitClick = async () => {
    const updatedFormData = {
      ...formData,
      subjects: selectedSubjects,
      specializations: selectedSpecializations,
    };
    onChange(updatedFormData);

    const fd = new FormData();
    Object.entries(updatedFormData).forEach(([key, value]) => {
      if (key === "subjects" || key === "specializations") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    try {
      await ApiFacade.registerUser(fd);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="subject-outer-container">
      <div className="step-4-tutor-image">
        <img src={backgroundImage} alt="Tutor illustration" />
      </div>
      <div className="subject-adjusted-width-container">
        <h2>Choose the subjects you can teach</h2>
        <div className="form-section">
          <span className="side-text">Subjects:</span>
          <SelectorFactory
            type="subject"
            availableSubjects={availableSubjects}
            selectedSubjects={selectedSubjects}
            onSelect={handleSubjectSelect}
            onRemove={handleSubjectRemove}
            colorMap={colorMap}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        {selectedSubjects.length > 0 && (
          <div className="form-section">
            <span className="side-text">Specializations:</span>
            <SelectorFactory
              type="specialization"
              selectedSubjects={selectedSubjects}
              selectedSpecializations={selectedSpecializations}
              availableSpecializations={availableSpecializations}
              onSelectSpecialization={handleSpecializationSelect}
              onRemoveSpecialization={handleSpecializationRemove}
              colorMap={colorMap}
            />
          </div>
        )}

        <div className="form-button-container">
          <Button text="Back" className="outline-button" onClick={onBack} />
          <Button
            text="Next"
            className={isFormComplete ? "blue-button" : "gray-button"}
            onClick={handleSubmitClick}
            disabled={!isFormComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default withLogger(TutorSubjectsStep);
