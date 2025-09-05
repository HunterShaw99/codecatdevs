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
}

export const Navigation = ({ items, className = "" }: NavigationProps) => {
  return (
    <div className={`nav-header ${className}`}>
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