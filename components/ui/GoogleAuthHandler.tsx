"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/utils/session';

export function GoogleAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // Get profile data from cookie
    const cookies = document.cookie.split(';');
    const profileCookie = cookies.find(cookie => cookie.trim().startsWith('user_profile='));
    
    if (profileCookie) {
      try {
        // Parse and store profile data
        const profileData = JSON.parse(decodeURIComponent(profileCookie.split('=')[1]));
        sessionStorage.setProfile(profileData);
        
        // Clean up the cookie
        document.cookie = 'user_profile=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error processing Google auth profile:', error);
        router.push('/login?error=ProfileProcessingFailed');
      }
    }
  }, [router]);

  return null;
} 