'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/cn';

interface CardProps {
  children: ReactNode;
  variant?: 'primary' | 'solution' ;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = 'primary',
  className = "",
  asChild = false,
  onClick
}: CardProps) => {
  const cardClasses = {
    primary: 'card-primary',
    solution: 'card-solution'
  };

  const Component = asChild ? 'div' : 'div';

  return (
    <Component
      className={`${cardClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};