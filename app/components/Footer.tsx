'use client'
import React from "react"
import DarkModeToggle from '@/components/DarkModeToggle';

export const Footer = () => {
  return (
    <footer
      className="w-full py-4 text-center bg-[#464141] text-[#f2f2f2] dark:bg-[#18181b] dark:text-[#e4e4e7] transition-colors"
    >
      <p>
        <a href="mailto:tech@codecatdevs.com" className="underline hover:text-[#bdbdbd] dark:hover:text-[#a1a1aa]">
          tech@codecatdevs.com
        </a>
        {" "} | © {new Date().getFullYear()} Code Cat Developers
      </p>
      <div className="mt-2 flex justify-center">
        <DarkModeToggle />
      </div>
    </footer>
  );
};

export default Footer;