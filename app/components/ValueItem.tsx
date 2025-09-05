'use client';

import { ReactNode } from 'react';

interface ValueItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
}

export const ValueItem = ({
  icon,
  title,
  description,
  iconColor = "",
  iconBgColor = ""
}: ValueItemProps) => {
  return (
    <div className="value-item">
      <div className={`icon-small ${iconBgColor}`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="value-content">{title}</h3>
        <p className="text-small">{description}</p>
      </div>
    </div>
  );
};