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
        <h3 className="value-content text-text">{title}</h3>
        <p className="text-small text-subtext1">{description}</p>
      </div>
    </div>
  );
};