"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { clearUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSession } from "@/lib/hooks/useSession";
import LanguageSwitcher from "./language-switcher";

interface DashboardHeaderProps {
  user: {
    name?: string;
    email?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const router = useRouter();
  const { logout } = useSession();
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser()); // Clear user state from Redux
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }; 

  return (
    <div className="flex h-[70px] items-center justify-between bg-surface-light-elevated dark:bg-surface-dark-base px-6 shadow-elevation-1 dark:shadow-dark-elevation-1">
      {/* Left side */}
      <div className="flex items-center">
        <div className="ml-6 flex gap-2">
          <h3 className="text-accent-light-primary dark:text-accent-dark-primary text-sm font-semibold hidden lg:block md:block">
            {t('dashboard.header.upgrade_message')}
          </h3>
          <Link href="/pricing" className="text-sm text-blue-500 dark:text-blue-400 font-semibold underline ml-4 lg:ml-0 md:ml-0">
            {t('dashboard.header.view_plans')}
          </Link>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
        <Separator orientation="vertical" className="h-6" />
        {!user?.email ? (
          <Link href="/sign-in">
          <Button
            
            className="btn-primary"
          >
            {t('mobileMenu.signIn')}
          </Button>
        </Link>
        ):  <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback>
              {user?.email
                ?.substring(0, 2)
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-surface-light-paper dark:bg-surface-dark-paper border border-border-light dark:border-border-dark shadow-elevation-2 dark:shadow-dark-elevation-2"
          align="end"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-none">
                {user?.email}
              </p>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs">
                {user?.name}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border-light dark:bg-border-dark" />
          
          <DropdownMenuItem 
            onClick={() => router.push("/profile")}
            className="flex items-center px-3 py-2 text-text-light-primary dark:text-text-dark-primary cursor-pointer
                      hover:bg-ui-light-hover dark:hover:bg-ui-dark-hover
                      active:bg-primary-100 dark:active:bg-primary-900
                      focus:bg-ui-light-hover dark:focus:bg-ui-dark-hover
                      transition-colors duration-200"
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t('nav.profile')}</span>
          </DropdownMenuItem>
          
          {/* <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="flex items-center px-3 py-2 text-text-light-primary dark:text-text-dark-primary cursor-pointer
                      hover:bg-ui-light-hover dark:hover:bg-ui-dark-hover
                      active:bg-primary-100 dark:active:bg-primary-900
                      focus:bg-ui-light-hover dark:focus:bg-ui-dark-hover
                      transition-colors duration-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
          
          <DropdownMenuSeparator className="bg-border-light dark:bg-border-dark" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-feedback-error-light dark:text-feedback-error-dark cursor-pointer
                      hover:bg-ui-light-hover dark:hover:bg-ui-dark-hover
                      active:bg-primary-100 dark:active:bg-primary-900
                      focus:bg-ui-light-hover dark:focus:bg-ui-dark-hover
                      transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('mobileMenu.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>}
        
      </div>
    </div>
  );
}