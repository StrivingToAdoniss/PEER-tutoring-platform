// src/components/withLogger.js
import React, { useEffect } from "react";

export function withLogger(WrappedComponent) {
  const name = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const Logger = (props) => {
    useEffect(() => {
      console.log(`[withLogger] ${name}`, props);
    }, [props]);

    return <WrappedComponent {...props} />;
  };

  Logger.displayName = `withLogger(${name})`;
  return Logger;
}
