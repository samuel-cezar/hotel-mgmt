import React from 'react';

/**
 * Alert Component
 * Unified alert for errors, success, warnings, and info messages
 */
const Alert = ({
  type = 'info', // 'success', 'error', 'warning', 'info'
  message = '',
  title = null,
  onClose = null,
  dismissible = true,
  children = null,
}) => {
  if (!message && !children && !title) {
    return null;
  }

  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass} role="alert">
      <div style={{ flex: 1 }}>
        {title && <strong>{title}</strong>}
        {message && <div>{message}</div>}
        {children}
      </div>
      {dismissible && onClose && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
