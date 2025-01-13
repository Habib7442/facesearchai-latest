"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, History, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { UserData } from "@/types/auth";
import { sessionStorage } from "@/lib/utils/session";

export function NavLinks() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const userProfile = sessionStorage.getProfile() as UserData | null;
    setUser(userProfile);
  }, []);

  const links = !user?.email ? [
    { 
      href: "/", 
      label: t('nav.home'), 
      icon: Home,
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950",
      activeColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-slate-900 dark:text-gray-100"
    },
    { 
      href: "/search", 
      label: t('nav.search'), 
      icon: Search,
      bgColor: "hover:bg-purple-50 dark:hover:bg-purple-950",
      activeColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-500 dark:text-gray-100"
    }
  ] : [
    { 
      href: "/dashboard", 
      label: t('nav.dashboard'), 
      icon: Home,
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950",
      activeColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-slate-900 dark:text-gray-100"
    },
    { 
      href: "/search", 
      label: t('nav.search'), 
      icon: Search,
      bgColor: "hover:bg-purple-50 dark:hover:bg-purple-950",
      activeColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-500 dark:text-gray-100"
    },
    { 
      href: "/history", 
      label: t('nav.history'), 
      icon: History,
      bgColor: "hover:bg-green-50 dark:hover:bg-green-950",
      activeColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-500 dark:text-gray-100"
    },
    { 
      href: "/profile", 
      label: t('nav.profile'), 
      icon: User,
      bgColor: "hover:bg-red-50 dark:hover:bg-red-950",
      activeColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-500 dark:text-gray-100"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link 
            key={link.href} 
            href={link.href}
          >
            <div
              className={cn(
                "relative px-4 py-2 rounded-lg transition-all duration-200",
                "flex items-center gap-2",
                isActive ? link.activeColor : link.bgColor,
                "group hover:scale-105 active:scale-95"
              )}
            >
              <Icon 
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isActive 
                    ? link.textColor
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                )} 
                strokeWidth={isActive ? 2 : 1.5} 
              />
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive 
                    ? link.textColor
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                )}
              >
                {link.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
