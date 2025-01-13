"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";

interface User {
  id: number;
  name: string;
  email: string;
}

interface SessionState {
  isLoggedIn: boolean;
  user: User | null;
}

const SESSION_TIMEOUT = 28 * 60 * 1000; // 28 minutes in milliseconds

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    isLoggedIn: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await fetch("/api/logout", { method: "POST" });
      dispatch(clearUser());
      setSession({ isLoggedIn: false, user: null });
      localStorage.removeItem("user");
      sessionStorage.removeItem('session');
      sessionStorage.removeItem('sessionStart');
      toast.success("Logged out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router, dispatch]);

  useEffect(() => {
    let isMounted = true;
    let logoutTimer: NodeJS.Timeout;

    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        if (isMounted) {
          setSession(data);
          sessionStorage.setItem('session', JSON.stringify(data));
          sessionStorage.setItem('sessionStart', Date.now().toString());
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        if (isMounted) {
          setSession({ isLoggedIn: false, user: null });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const setupSessionTimeout = () => {
      const sessionStart = sessionStorage.getItem('sessionStart');
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart);
        const remaining = Math.max(0, SESSION_TIMEOUT - elapsed);
        
        if (remaining <= 0) {
          logout();
        } else {
          logoutTimer = setTimeout(() => {
            toast.error("Session expired. Please login again.");
            logout();
          }, remaining);
        }
      }
    };

    const cachedSession = sessionStorage.getItem('session');
    if (cachedSession) {
      setSession(JSON.parse(cachedSession));
      setLoading(false);
      setupSessionTimeout();
    } else {
      fetchSession();
    }

    return () => {
      isMounted = false;
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [logout]);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/session");
      const data = await response.json();
      setSession(data);
      sessionStorage.setItem('sessionStart', Date.now().toString());
    } catch (error) {
      console.error("Session refresh error:", error);
      setSession({ isLoggedIn: false, user: null });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    loading,
    logout,
    refreshSession,
    isAuthenticated: session.isLoggedIn && session.user !== null,
  };
}