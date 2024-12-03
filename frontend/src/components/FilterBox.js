import React, { useState } from 'react';
import { RangeSlider } from './RangeSlider'; // Import your custom RangeSlider component
import styles from '../styles/FilterBox.module.css';

const FilterBox = ({
  subjects = [],
  locations = [],
  universities = [],
  priceRange = [1, 500],
  currencyCode = '€',
  minDistance = 1, // Minimum distance between the min and max price
  onFilterChange,
}) => {
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [mode, setMode] = useState('');
  const [priceRangeState, setPriceRangeState] = useState(priceRange); // State for price range
  const [gender, setGender] = useState('');
  const [university, setUniversity] = useState('');
  const [isPriceOpen, setIsPriceOpen] = useState(false); // To toggle price slider visibility

  const handlePriceChange = (newPriceRange) => {
    setPriceRangeState(newPriceRange);
    handleFilterChange({ priceRange: newPriceRange });
  };

  // Call when any filter changes
  const handleFilterChange = (updatedFilters = {}) => {
    const filters = {
      subject,
      location,
      mode,
      priceRange: priceRangeState,
      gender,
      university,
      ...updatedFilters,
    };
    onFilterChange(filters);
  };

  return (

    <div className={styles.filterBoxContainer}>
      <div className={styles.filterBox}>
        {/* Subject dropdown */}
        <div className={styles.filterItem}>
          <label>I want to learn</label>
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              handleFilterChange();
            }}
          >
            <option value=""disabled hidden>Select subject</option>
            {subjects.map((subj, index) => (
              <option key={index} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Location dropdown */}

        <div className={styles.filterItem}>
          <label>Location</label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Any</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* University dropdown */}
        <div className={styles.filterItem}>

          <label>University</label>
          <select
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Any</option>
            {universities.map((uni, index) => (
              <option key={index} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Mode dropdown (Online/Offline) */}

        <div className={styles.filterItem}>
          <label>Mode</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Either</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>


        <div className={styles.filterItem} style={{ position: 'relative' }}>
          <label>Price per lesson</label>
          <div
            className={styles.priceDisplay}
            onClick={() => setIsPriceOpen(!isPriceOpen)}
          
            {priceRangeState[0]} {currencyCode} – {priceRangeState[1]} {currencyCode}
            <button className={styles.toggleButton}>

              {isPriceOpen ? '✖' : '▼'}
            </button>
          </div>
          {isPriceOpen && (

            <div className={styles.customSliderContainer}>

              <RangeSlider
                min={priceRange[0]}
                max={priceRange[1]}
                step={1} // Adjust step value as needed
                value={priceRangeState}
                onChange={handlePriceChange}
                isShowTooltip={true} // Optional: Show tooltips if needed
                minDistance={minDistance} // Pass minDistance to RangeSlider
              />
            </div>
          )}
        </div>


        <div className={styles.filterItem }>

          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
