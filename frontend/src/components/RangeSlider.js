import React, { memo, useEffect, useRef, useState } from 'react';
import '../styles/RangeSlider.css';

const RangeSliderComponent = ({
  classes,
  max,
  min,
  onChange,
  step,
  value,
  minDistance = 0,
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const rangeRef = useRef(null);

  useEffect(() => {
    if (rangeRef.current) {
      const range = max - min;
      const minPercent = ((minValue - min) / range) * 100;
      const maxPercent = ((maxValue - min) / range) * 100;

      // Adjust range track position and width
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [max, maxValue, min, minValue]);

  const handleChangeMin = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - minDistance);
    setMinValue(value);
    onChange && onChange([value, maxValue]);
  };

  const handleChangeMax = (event) => {
    const value = Math.max(Number(event.target.value), minValue + minDistance);
    setMaxValue(value);
    onChange && onChange([minValue, value]);
  };

  return (
    <div className="RangeSlider">
      <div className="RangeSlider-Slider">
        <div className="RangeSlider-Slider-Track"></div>
        <div className="RangeSlider-Slider-Range" ref={rangeRef}></div>
        <input
          className="RangeSlider-Slider-Input RangeSlider-Slider-Input-Min"
          max={max}
          min={min}
          onChange={handleChangeMin}
          step={step}
          type="range"
          value={minValue}
        />
        <input
          className="RangeSlider-Slider-Input RangeSlider-Slider-Input-Max"
          max={max}
          min={min}
          onChange={handleChangeMax}
          step={step}
          type="range"
          value={maxValue}
        />
      </div>
    </div>
  );
};

export const RangeSlider = memo(RangeSliderComponent);
