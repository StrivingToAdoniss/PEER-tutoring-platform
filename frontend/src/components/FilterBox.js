import React, { useState } from 'react';
import '../styles/FilterBox.css';
import { RangeSlider } from './RangeSlider'; // Import your custom RangeSlider component

const FilterBox = ({
  subjects = [],
  locations = [],
  universities = [],
  priceRange = [0, 500],
  currencyCode = '€',
  minDistance = 50,  // Minimum distance between the min and max price
  onFilterChange
}) => {
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [mode, setMode] = useState('');
  const [priceRangeState, setPriceRangeState] = useState(priceRange);  // State for price range
  const [gender, setGender] = useState('');
  const [university, setUniversity] = useState('');
  const [isPriceOpen, setIsPriceOpen] = useState(false);  // To toggle price slider visibility

  const handlePriceChange = (newPriceRange) => {
    setPriceRangeState(newPriceRange);
    handleFilterChange();
  };

  // Call when any filter changes
  const handleFilterChange = () => {
    onFilterChange({
      subject,
      location,
      mode,
      priceRange: priceRangeState,
      gender,
      university,
    });
  };

  return (
    <div className="filter-box-container">
      <div className="filter-box">
        {/* Subject dropdown */}
        <div className="filter-item">
          <label>I want to learn</label>
          <select value={subject} onChange={(e) => { setSubject(e.target.value); handleFilterChange(); }}>
            <option value="">Select subject</option>
            {subjects.map((subj, index) => (
              <option key={index} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

        {/* Location dropdown */}
        <div className="filter-item">
          <label>Location</label>
          <select value={location} onChange={(e) => { setLocation(e.target.value); handleFilterChange(); }}>
            <option value="">Any</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* University dropdown */}
        <div className="filter-item">
          <label>University</label>
          <select value={university} onChange={(e) => { setUniversity(e.target.value); handleFilterChange(); }}>
            <option value="">Any</option>
            {universities.map((uni, index) => (
              <option key={index} value={uni}>{uni}</option>
            ))}
          </select>
        </div>

        {/* Mode dropdown (Online/Offline) */}
        <div className="filter-item">
          <label>Mode</label>
          <select value={mode} onChange={(e) => { setMode(e.target.value); handleFilterChange(); }}>
            <option value="">Either</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Price Range Box with Custom Slider */}
        <div className="filter-item price-range-box">
          <label>Price per lesson</label>
          <div className="price-display" onClick={() => setIsPriceOpen(!isPriceOpen)}>
            {priceRangeState[0]} {currencyCode} – {priceRangeState[1]} {currencyCode}
            <button className="toggle-button">{isPriceOpen ? '✖' : '▼'}</button>
          </div>
          {isPriceOpen && (
            <div className="custom-slider-container">
              {/* Use the custom RangeSlider component */}
              <RangeSlider
                min={priceRange[0]}
                max={priceRange[1]}
                step={10}  // Adjust step value as needed
                value={priceRangeState}
                onChange={handlePriceChange}
                isShowTooltip={true} // Optional: Show tooltips if needed
              />
            </div>
          )}
        </div>

        {/* Gender dropdown */}
        <div className="filter-item">
          <label>Gender</label>
          <select value={gender} onChange={(e) => { setGender(e.target.value); handleFilterChange(); }}>
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
