import React from 'react';
import styles from '../styles/SpecializationSelector.module.css';

const SpecializationSelector = ({
  selectedSubjects,
  selectedSpecializations,
  availableSpecializations,
  onSelectSpecialization,
  onRemoveSpecialization,
  colorMap
}) => {
  return (
    <div className={styles.filterItem}>
      {selectedSubjects.map((subject) => {
        // Check if there are any specializations left to select for this subject
        const isDisabled = !availableSpecializations[subject]?.length;

        return (
          <div key={subject} className={styles.specializationSection}>
            <label>Specializations for {subject}:</label>
            <select
              onChange={(e) => onSelectSpecialization(subject, e.target.value)}
              value=""
              disabled={isDisabled} // Disable the dropdown if no options are left
            >
              <option value="" disabled hidden>
                {isDisabled ? `All specializations selected for ${subject}` : `Select a specialization for ${subject}`}
              </option>
              {availableSpecializations[subject]?.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <div className={styles.selectedItems}>
              {selectedSpecializations[subject]?.map((specialization) => (
                <span
                  key={specialization}
                  className={styles.itemTag}
                  style={{ backgroundColor: colorMap[specialization] }}
                >
                  {specialization}
                  <button
                    className={styles.removeButton}
                    onClick={() => onRemoveSpecialization(subject, specialization)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpecializationSelector;
