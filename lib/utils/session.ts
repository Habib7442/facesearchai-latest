import type { UserData } from "@/types/auth";

const PROFILE_KEY = 'user_profile';

export const sessionStorage = {
  setProfile: (profile: UserData) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },

  getProfile: (): UserData | null => {
    try {
      const profile = localStorage.getItem(PROFILE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  clearProfile: () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  }
}; 