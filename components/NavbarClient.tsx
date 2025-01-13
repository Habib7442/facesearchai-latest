"use client";

import { useState, useEffect } from "react";
import { MobileMenu } from "@/components/Navigation/mobile-menu";
import { NavLinks } from "@/components/Navigation/nav-links";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Logo from "@/components/ui/Logo";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/store/slices/userSlice";
import { useAuth } from "@/contexts/auth-context";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { sessionStorage } from "@/lib/utils/session";
import type { UserData } from "@/types/auth";

interface NavbarClientProps {
  pathname: string;
}

export function NavbarClient({ pathname }: NavbarClientProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const user = useSelector(selectUser);
  const { logout } = useAuth();
  const { t } = useTranslation("common");

  useEffect(() => {
    setMounted(true);
    
    // Load user profile from localStorage on mount
    const storedProfile = sessionStorage.getProfile();
    console.log('Stored profile:', storedProfile); // Debug log
    
    if (storedProfile && !user) {
      console.log('Setting user from stored profile'); // Debug log
      dispatch(setUser(storedProfile));
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!mounted) return null;

  // Early return if no user data
  if (!user) {
    return (
      <nav className="w-full sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-full mx-auto sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 flex justify-start">
              <Logo />
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link href="/sign-in">
                <Button className="gap-2 text-white">
                  {t("mobileMenu.signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-full mx-auto sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex-1 flex justify-start">
            <Logo />
          </div>

          {/* Center Section - Navigation Links */}
          <div className="flex-1 flex justify-center">
            <div className="hidden lg:flex items-center">
              <NavLinks user={user} />
            </div>
          </div>

          {/* Right Section - Theme Toggle & Actions */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />

              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 ring-primary/20 transition-all">
                        {user.profile_url ? (
                          <Image 
                            src={user.profile_url} 
                            alt={user.name || ''} 
                            width={32} 
                            height={32}
                          />
                        ) : (
                          <AvatarFallback>
                            {user.email?.substring(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{user.name || user.email}</p>
                            {user.is_verified && (
                              <Badge variant="success" className="ml-2">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Subscription Info */}
                      {user.subscription && (
                        <>
                          <div className="px-2 py-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {user.subscription.plan_id.replace('_', ' ').toUpperCase()}
                              </span>
                              <Badge variant={user.subscription.premium_status ? "success" : "secondary"}>
                                {user.subscription.subscription_status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              Expires: {formatDate(user.subscription.expiry_date)}
                            </p>
                          </div>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {/* Credits Info */}
                      {user.credits && (
                        <>
                          <div className="px-2 py-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Credits</span>
                              <span className="text-xs text-gray-500">
                                {user.credits.remaining}/{user.credits.total}
                              </span>
                            </div>
                            <Progress 
                              value={(user.credits.remaining / user.credits.total) * 100} 
                              className="h-2"
                            />
                          </div>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {/* Navigation Items */}
                      <DropdownMenuItem
                        onClick={() => router.push("/profile")}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.profile')}</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Total Searches */}
                      <div className="px-2 py-1.5">
                        <p className="text-xs text-gray-500">
                          Total Searches: {user.total_searches}
                        </p>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('mobileMenu.logout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                      {t("hero.dashboard")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/sign-in">
                  <Button className="gap-2 text-white">
                    {t("mobileMenu.signIn")}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <MobileMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
