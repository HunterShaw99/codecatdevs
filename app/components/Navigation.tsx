'use client';

import { useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

/**
 * A responsive navigation header that turns into a hamburger‑style menu on mobile.
 *
 * @example
 * <Navigation
 *   title="My App"
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'About', href: '/about' }
 *   ]}
 * />
 */
interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  title?: string;
}

/**
 * A navigation component that automatically switches to a hamburger menu
 * on mobile devices.
 *
 * The implementation uses Radix UI's `NavigationMenu` for the link styling,
 * but keeps the responsive logic inside this wrapper. Tailwind classes are
 * used for layout and visibility control.
 */
export const Navigation = ({
  items,
  className = '',
  title,
}: NavigationProps) => {
  // Tracks whether the mobile menu overlay is visible.
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <header className={`nav-header ${className}`}>
      {/* Title section – always visible */}
      {title && (
        <div className="px-1 sm:px-2 lg:px-4 xl:px-8 mx-auto flex justify-center">
          <h1 className="heading-main text-center">{title}</h1>
        </div>
      )}

      {/* --- Desktop navigation (visible on md+ screens) --- */}
      <NavigationMenu.Root className="hidden md:flex justify-center">
        <NavigationMenu.List className="flex space-x-6">
          {items.map((item) => (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link href={item.href} className="nav-link">
                {item.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* --- Mobile hamburger button (visible on <md screens) --- */}
      <div className="flex md:hidden justify-end px-4 py-2">
        <button
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          {/* Simple hamburger / close icon – replace with your SVG/icon as needed */}
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <>
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </>
            ) : (
              <>
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* --- Mobile overlay menu (visible when isOpen === true) --- */}
      {isOpen && (
  <nav
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60"
    aria-label="Mobile navigation"
  >
    <div className="relative w-full max-w-xs mx-auto rounded-lg shadow-xl p-6">
      <button
        type="button"
        aria-label="Close menu"
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1={18} y1={6} x2={6} y2={18} />
          <line x1={6} y1={6} x2={18} y2={18} />
        </svg>
      </button>

      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={handleClose}
          className="block text-xl font-medium text--ctp-text mb-4"
        >
          {item.label}
        </a>
      ))}
    </div>
  </nav>
)}
    </header>
  );
};
