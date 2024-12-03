import React from 'react';
import '../styles/SubjectTag.css';

const SubjectTag = ({ subject, onSelect, onRemove, selected }) => {
  return (
    <div className={`subject-tag ${selected ? 'selected' : ''}`} onClick={selected ? onRemove : onSelect}>
      {subject}
      {selected && <span className="remove-tag">x</span>}
    </div>
  );
};

export default SubjectTag;
