'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  variant = 'primary',
  className = "",
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) => {
  const buttonClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };

  return (
    <button
      type={type}
      className={`${buttonClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};