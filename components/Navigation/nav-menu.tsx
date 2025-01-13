"use client"

import { useNavLinks } from "./nav-links"
// ... other imports

export function NavMenu() {
  const links = useNavLinks()
  
  return (
    <nav>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          // ... rest of your link implementation
        >
          {/* ... */}
        </Link>
      ))}
    </nav>
  )
} 