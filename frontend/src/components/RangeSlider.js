import React, { useEffect, useRef, useState } from "react";
import "../styles/RangeSlider.css"; // Ensure this file is created with correct styles

const RangeSliderComponent = ({ max, min, onChange, step, value }) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const trackRef = useRef(null);

  // Update the slider track width and position
  useEffect(() => {
    if (trackRef.current) {
      const minLeft = `${((minValue - min) / (max - min)) * 100}%`;
      const maxRight = `${((max - maxValue) / (max - min)) * 100}%`;
      trackRef.current.style.left = minLeft;
      trackRef.current.style.right = maxRight;
    }
  }, [minValue, maxValue, min, max]);

  const handleMinChange = (event) => {
    const value = Number(event.target.value);
    if (value <= maxValue) {
      setMinValue(value);
      onChange([value, maxValue]);
    }
  };

  const handleMaxChange = (event) => {
    const value = Number(event.target.value);
    if (value >= minValue) {
      setMaxValue(value);
      onChange([minValue, value]);
    }
  };

  return (
    <div className="RangeSlider">
      <div className="RangeSlider-Slider">
        <div className="RangeSlider-Slider-Track" ref={trackRef}></div>
        <input
          className="RangeSlider-Slider-Input"
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          step={step}
        />
        <input
          className="RangeSlider-Slider-Input"
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          step={step}
        />
      </div>
    </div>
  );
};

export const RangeSlider = RangeSliderComponent;
