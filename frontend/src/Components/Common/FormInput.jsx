import React from 'react';

/**
 * FormInput Component
 * Standardized text input field with validation, help text, and error handling
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error = null,
  helpText = null,
  placeholder = '',
  required = false,
  disabled = false,
  validated = null, // 'success', 'error', or null
  maxLength = null,
  className = '',
  ...rest
}) => {
  const inputClasses = [
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
      <input
        id={name}
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={inputClasses}
        {...rest}
      />
      {error && <div className="error-message">{error}</div>}
      {helpText && !error && <div className="help-text">{helpText}</div>}
      {maxLength && type === 'text' && (
        <div className="character-counter">
          {value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default FormInput;
