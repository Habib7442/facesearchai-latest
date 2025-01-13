'use client'

import { NavbarClient } from "@/components/NavbarClient";
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <div className="w-full bg-white/80 dark:bg-surface-dark-base backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 h-16">
        <div className="flex items-center justify-between h-full">
          <NavbarClient pathname={pathname} />
        </div>
      </nav>
    </div>
  );
}
