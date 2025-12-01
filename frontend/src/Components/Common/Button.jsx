import React from 'react';

/**
 * Button Component
 * Standardized button with variants and states
 */
const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success'
  size = 'md', // 'sm', 'md', 'lg'
  type = 'button',
  disabled = false,
  loading = false,
  block = false,
  icon = null,
  onClick = null,
  className = '',
  ...rest
}) => {
  const buttonClasses = [
    `btn-${variant}`,
    `btn-${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}`,
    block && 'btn-block',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
