'use client';

import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = React.forwardRef(({ 
  value = 0,
  onChange,
  readOnly = false,
  size = 'default',
  className = '',
  ...props
}, ref) => {
  const [hoverValue, setHoverValue] = React.useState(0);

  const handleMouseEnter = (index) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(0);
  };

  const handleClick = (index) => {
    if (readOnly) return;
    onChange?.(index);
  };

  const displayValue = hoverValue || value;

  const sizeClasses = {
    default: 'h-5 w-5',
    sm: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  const renderStar = (index) => {
    const filled = index <= displayValue;
    const halfFilled = index - 0.5 === displayValue;

    return (
      <button
        key={index}
        type="button"
        className={`
          inline-flex items-center justify-center
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
          ${filled ? 'text-yellow-400' : 'text-gray-300'}
          hover:text-yellow-400
          transition-colors
          focus:outline-none
          disabled:cursor-not-allowed
        `}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        disabled={readOnly}
      >
        {halfFilled ? (
          <StarHalf className={sizeClasses[size]} />
        ) : (
          <Star
            className={sizeClasses[size]}
            fill={filled ? 'currentColor' : 'none'}
          />
        )}
      </button>
    );
  };

  return (
    <div
      ref={ref}
      className={`inline-flex ${className}`}
      {...props}
    >
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
});

Rating.displayName = 'Rating';

export { Rating };