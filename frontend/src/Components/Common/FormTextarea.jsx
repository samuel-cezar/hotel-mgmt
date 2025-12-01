import React from 'react';

/**
 * FormTextarea Component
 * Standardized textarea with validation and character counter
 */
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error = null,
  helpText = null,
  placeholder = '',
  required = false,
  disabled = false,
  validated = null, // 'success', 'error', or null
  rows = 5,
  maxLength = null,
  className = '',
  ...rest
}) => {
  const textareaClasses = [
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
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        {...rest}
      />
      {error && <div className="error-message">{error}</div>}
      {helpText && !error && <div className="help-text">{helpText}</div>}
      {maxLength && (
        <div className="character-counter">
          {value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default FormTextarea;
