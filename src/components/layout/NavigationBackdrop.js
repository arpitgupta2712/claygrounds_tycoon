import React from 'react';

/**
 * Navigation Backdrop Component
 * Provides a backdrop overlay for mobile navigation
 * Handles click-to-close functionality
 */
const NavigationBackdrop = ({ 
  isVisible = false, 
  onClick,
  className = "" 
}) => {
  const handleClick = (event) => {
    // Prevent event bubbling
    event.stopPropagation();
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className={`cg-nav-backdrop ${isVisible ? 'active' : ''} ${className}`}
      onClick={handleClick}
      style={{
        // Ensure backdrop is only visible when needed
        display: isVisible ? 'block' : 'none'
      }}
      aria-hidden={!isVisible}
      role="button"
      tabIndex={isVisible ? 0 : -1}
    />
  );
};

export default NavigationBackdrop; 