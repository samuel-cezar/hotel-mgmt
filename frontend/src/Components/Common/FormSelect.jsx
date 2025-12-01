import React from 'react';

/**
 * FormSelect Component
 * Standardized select dropdown with validation and help text
 */
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error = null,
  helpText = null,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  validated = null, // 'success', 'error', or null
  className = '',
  ...rest
}) => {
  const selectClasses = [
    'form-field-input',
    validated === 'error' && 'input-error',
    validated === 'success' && 'input-success',
    className
  ].filter(Boolean).join(' ');

  const showValidationIndicator = validated && validated !== 'pending';

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
          {showValidationIndicator && (
            <span className={`validation-indicator ${validated}`} />
          )}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={selectClasses}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value || option.id}
            value={option.value || option.id}
          >
            {option.label || option.name}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
      {helpText && !error && <div className="help-text">{helpText}</div>}
    </div>
  );
};

export default FormSelect;
