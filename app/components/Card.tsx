'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/cn';

interface CardProps {
  children: ReactNode;
  variant?: 'primary' | 'solution' | 'solution-green' | 'solution-mauve' | 'solution-peach';
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
    solution: 'card-solution',
    'solution-green': 'card-solution-green',
    'solution-mauve': 'card-solution-mauve',
    'solution-peach': 'card-solution-peach'
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