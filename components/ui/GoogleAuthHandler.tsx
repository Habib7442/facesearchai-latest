"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/utils/session';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Separate component that uses useSearchParams
function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const profileParam = searchParams.get('profile');

  useEffect(() => {
    if (profileParam) {
      try {
        const profileData = JSON.parse(decodeURIComponent(profileParam));
        sessionStorage.setProfile(profileData);
        
        // Clear URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        router.push('/dashboard');
      } catch (error) {
        console.error('Error storing profile:', error);
        router.push('/sign-in?error=auth_failed');
      }
    }
  }, [profileParam, router]);

  if (!profileParam) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-muted-foreground">
          Authenticating...
        </span>
      </div>
    </div>
  );
}

// Main component that wraps AuthHandler in Suspense
export function GoogleAuthHandler() {
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading...
            </span>
          </div>
        </div>
      }
    >
      <AuthHandler />
    </Suspense>
  );
} 