import React from 'react';
import '../styles/SubjectSelector.css';
  
  const SubjectSelector = ({ availableSubjects, selectedSubjects, onSelect, onRemove, colorMap }) => {
    
    const isDisabled = availableSubjects.length === 0;
    return (
      <div className="filter-item">
         <select
          onChange={(e) => onSelect(e.target.value)}
          value=""
          disabled={isDisabled} // Disable if no available subjects
        >
          <option value="" disabled hidden>{isDisabled ? "All subjects selected" : "Choose a subject"}</option>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <div className="selected-items">
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="item-tag"
              style={{ backgroundColor: colorMap[subject] }}
            >
              {subject}
              <button className="remove-button" onClick={() => onRemove(subject)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  export default SubjectSelector;
  
