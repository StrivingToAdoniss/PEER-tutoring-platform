// src/components/SelectorFactory.js
import React from "react";
import RoleSelection          from "./RoleSelection";
import SubjectSelector        from "./SubjectSelector";
import SpecializationSelector from "./SpecializationSelector";

const selectorMap = {
  role:           RoleSelection,
  subject:        SubjectSelector,
  specialization: SpecializationSelector,
};

export default function SelectorFactory({ type, ...props }) {
  const Component = selectorMap[type];
  if (!Component) return null;
  return <Component {...props} />;
}
