'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ReactNode } from 'react';

interface NavigationItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  title?: string;
}

export const Navigation = ({ items, className = "", title }: NavigationProps) => {
  return (
    <div className={`nav-header ${className}`}>
      {title && (
        <div className="px-1 sm:px-1 lg:px-2 xl:px-4 2xl:px-8 mx-auto flex justify-center">
          <h1 className="heading-main text-center items-center justify-center">{title}</h1>
        </div>
      )}
      <NavigationMenu.Root className="flex justify-center">
        <NavigationMenu.List className="flex space-x-6">
          {items.map((item) => (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link
                href={item.href}
                className="nav-link"
              >
                {item.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
};