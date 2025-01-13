// hooks/useUser.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profile_url: string | null;
  platform: string;
  is_verified: boolean;
  is_active: boolean;
  is_locked: boolean;
  locked_at: string | null;
  failed_attempts: number;
  gsheet_link: string;
  fcm_token: string | null;
  subscription: {
    plan_id: string | null;
    premium_status: boolean;
    expiry_date: string;
    last_payment_date: string;
    purchase_token: string;
    subscription_status: string;
  };
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  total_searches: number;
  feedback: string | null;
}

export function useUser() {
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);

  return {
    user,
    loading,
    // Add some helpful getters
    email: user?.email,
    name: user?.name,
    isVerified: user?.is_verified,
    credits: user?.credits,
    subscription: user?.subscription
  };
}
