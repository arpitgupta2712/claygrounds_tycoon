import React, { useState } from 'react';

const PasswordInput = ({ value, onChange, className, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`cg-password-input ${className || ''}`}>
      <div className="cg-input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder || 'Enter password'}
          className="cg-input"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="cg-btn cg-btn-icon"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput; 