'use client';

import { ReactNode } from 'react';
import { Card } from './Card';

interface SolutionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'solution';
  iconBgColor?: string;
  iconColor?: string;
}

export const SolutionCard = ({
  icon,
  title,
  description,
  variant = 'solution',
  iconBgColor = 'bg-blue/20',
  iconColor = 'text-blue'
}: SolutionCardProps) => {
  return (
    <Card variant={variant}>
      <div className="flex items-center mb-4">
        <div className={`icon-container ${iconBgColor}`}>
          <div className={`w-6 h-6 ${iconColor}`}>
            {icon}
          </div>
        </div>
        <h3 className="heading-subsection text-text">{title}</h3>
      </div>
      <p className="text-subtext1">{description}</p>
    </Card>
  );
};