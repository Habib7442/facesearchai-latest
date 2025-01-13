"use client";

import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, LogOut, Languages, HomeIcon, SearchIcon, MessageSquareIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UserProfile } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/hooks/useSession";
import LanguageSwitcher from "@/components/ui/language-switcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  profile?: UserProfile;
}

export function MobileMenu({ profile }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { logout } = useSession();
  const { t } = useTranslation('common');

  const navigationLinks = [
    { 
      href: "/", 
      label: t('nav.home'), 
      icon: <HomeIcon className="w-5 h-5" /> 
    },
    { 
      href: "/search", 
      label: t('nav.search'), 
      icon: <SearchIcon className="w-5 h-5" /> 
    },
    { 
      href: "/feedback", 
      label: t('nav.feedback'), 
      icon: <MessageSquareIcon className="w-5 h-5" /> 
    },
    { 
      href: "/about", 
      label: t('nav.about'), 
      icon: <InfoIcon className="w-5 h-5" /> 
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      setShowLogoutDialog(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent/50 transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] p-0 bg-surface-light-base dark:bg-surface-dark-base"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6  bg-muted/10">
              {profile ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage
                      src={profile.avatar || '/default-avatar.png'}
                      alt={profile.name}
                      onError={(e) => {
                        // If image fails to load, set src to default avatar
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {profile.name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-left">
                      {profile.name}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>
              ) : (
                <SheetTitle>Menu</SheetTitle>
              )}
            </SheetHeader>

            <div className="flex-1 overflow-auto">
              <nav className="p-4 space-y-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center h-10 w-full rounded-md px-3",
                      "hover:bg-accent transition-colors text-foreground",
                      "group"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-5 h-5">
                        {typeof link.icon === 'function' 
                          ? link.icon({ className: "w-5 h-5" })
                          : link.icon
                        }
                      </span>
                      <span className="text-sm font-medium">
                        {link.label}
                      </span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-6 space-y-4 bg-muted/10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="hover:bg-accent/50"
                  >
                    {mounted && theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language</span>
                  <LanguageSwitcher />
                </div>
              </div>

              {profile && profile?.avatar ? (
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
