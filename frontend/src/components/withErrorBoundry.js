import React from "react";

export function withErrorBoundary(WrappedComponent, fallback = null) {
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      console.error(`[withErrorBoundary] ${WrappedComponent.name}`, error, info);
    }

    render() {
      if (this.state.hasError) {
        return fallback || <div>Something went wrong.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  ErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.name})`;
  return ErrorBoundary;
}
