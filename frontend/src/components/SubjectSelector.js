import React from 'react';
import styles from '../styles/SubjectSelector.module.css';

const SubjectSelector = ({ availableSubjects, selectedSubjects, onSelect, onRemove, colorMap }) => {
  const isDisabled = availableSubjects.length === 0;
  return (
    <div className={styles.filterItem}>
      <select
        className={styles.filterItemSelect}
        onChange={(e) => onSelect(e.target.value)}
        value=""
        disabled={isDisabled}
      >
        <option value="" disabled hidden>
          {isDisabled ? 'All subjects selected' : 'Choose a subject'}
        </option>
        {availableSubjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <div className={styles.selectedItems}>
        {selectedSubjects.map((subject) => (
          <span
            key={subject}
            className={styles.itemTag}
            style={{ backgroundColor: colorMap[subject] }}
          >
            {subject}
            <button
              className={styles.removeButton}
              onClick={() => onRemove(subject)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
