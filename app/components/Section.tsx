'use client';

import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({ id, children, className = "" }: SectionProps) => {
  return (
    <section id={id} className={`section-spacing ${className}`}>
      {children}
    </section>
  );
};