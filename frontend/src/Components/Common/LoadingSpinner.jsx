import React from 'react';

/**
 * LoadingSpinner Component
 * Displays loading indicator
 */
const LoadingSpinner = ({ size = 'md', inline = false }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : 'spinner-border';

  if (inline) {
    return <div className={`spinner-border ${sizeClass}`} />;
  }

  return (
    <div className="spinner-overlay">
      <div className={`spinner-border ${sizeClass}`} />
    </div>
  );
};

export default LoadingSpinner;
