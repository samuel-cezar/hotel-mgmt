import React from 'react';
import Button from './Button';

/**
 * FormContainer Component
 * Wrapper for forms with 2-column grid on desktop, standardized layout
 */
const FormContainer = ({
  title = null,
  subtitle = null,
  onSubmit = null,
  children = null,
  loading = false,
  disabled = false,
  singleColumn = false,
  actions = null, // Custom action buttons
  cancelButton = false,
  onCancel = null,
  submitText = 'Save',
  className = '',
  ...rest
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      className={`form-wrapper ${loading ? 'loading' : ''} ${className}`.trim()}
      onSubmit={handleSubmit}
      {...rest}
    >
      {(title || subtitle) && (
        <div className="form-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className={`form-grid ${singleColumn ? 'single-column' : ''}`.trim()}>
        {children}
      </div>

      <div className="form-actions">
        {actions || (
          <>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || disabled}
              loading={loading}
            >
              {submitText}
            </Button>
            {cancelButton && (
              <Button
                variant="secondary"
                type="button"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default FormContainer;
