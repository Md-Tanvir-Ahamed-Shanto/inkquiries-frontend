import React from 'react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`
          animate-spin
          rounded-full
          border-primary
          border-t-transparent
          ${sizeClasses[size]}
          ${className}
        `}
      />
    </div>
  );
};

export default LoadingSpinner;