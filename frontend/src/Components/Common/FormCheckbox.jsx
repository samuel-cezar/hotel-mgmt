import React from 'react';

/**
 * FormCheckbox Component
 * Standardized checkbox with label and validation
 */
const FormCheckbox = ({
  label,
  name,
  checked = false,
  onChange,
  error = null,
  helpText = null,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-field">
      <div className="checkbox-wrapper">
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={className}
          {...rest}
        />
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      {error && <div className="error-message">{error}</div>}
      {helpText && !error && <div className="help-text">{helpText}</div>}
    </div>
  );
};

export default FormCheckbox;
