"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  History,
  UserCircle,
  LogOut,
  HomeIcon,
  NotebookIcon,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useSession } from "@/lib/hooks/useSession";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { logo } from "@/constants";

const routes = [
  {
    label: "Home",
    icon: HomeIcon,
    href: "/",
  },
  {
    label: "Search",
    icon: Search,
    href: "/search",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "History",
    icon: History,
    href: "/history",
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/profile",
  },
  {
    label: "Feedback",
    icon: NotebookIcon,
    href: "/feedback",
  },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const { logout } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setSheetOpen(false);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed top-4 left-4 md:hidden bg-white dark:bg-gray-950 shadow-sm border border-gray-200 dark:border-gray-800",
            "z-[49]",
            sheetOpen && "opacity-0"
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="flex flex-col w-64 p-0 bg-white dark:bg-surface-dark-paper z-[50]"
      >
        <SheetHeader className="flex items-start justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 py-4">
            <Image 
              src={logo[0].src} 
              alt={logo[0].alt} 
              width={100} 
              height={100} 
              className="object-contain rounded-full bg-black w-8 h-8" 
            />
            <span className="font-semibold">Face Search AI</span>
          </div>
        </SheetHeader>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setSheetOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-900",
                pathname === route.href ? 
                  "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400" : 
                  "text-gray-700 dark:text-gray-300"
              )}
            >
              <route.icon className={cn(
                "h-5 w-5 transition-colors",
                pathname === route.href ? 
                  "text-blue-600 dark:text-blue-400" : 
                  "text-gray-500 dark:text-gray-400"
              )} />
              <span className="font-medium text-sm">
                {route.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <div className="mt-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 p-6",
                  "text-red-600 hover:text-red-700 hover:bg-red-50",
                  "dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950",
                  "border-t border-gray-200 dark:border-gray-800"
                )}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium text-sm">Logout</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface-light-paper dark:bg-surface-dark-paper">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout? You&apos;ll need to sign in
                  again to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="bg-feedback-error-light hover:bg-feedback-error-light/90 dark:bg-feedback-error-dark dark:hover:bg-feedback-error-dark/90"
                >
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SheetContent>
    </Sheet>
  );
} 