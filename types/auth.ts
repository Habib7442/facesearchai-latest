export interface UserSession {
  isLoggedIn: boolean;
  user?: {
    id: string;
    name?: string;
    email: string;
    image?: string;
    phone?: string;
    is_verified?: boolean;
    is_active?: boolean;
    gsheet_link?: string;
    subscription?: {
      plan_id?: string;
      premium_status?: string;
      expiry_date?: string;
      last_payment_date?: string;
      purchase_token?: string;
      subscription_status?: string;
    };
    credits?: {
      total: number;
      used: number;
      remaining: number;
    };
    total_searches?: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string
  status?: number
}

export interface UserData {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  profile_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  gsheet_link: string | null;
  subscription?: {
    plan_id: string;
    premium_status: boolean;
    expiry_date: string;
    last_payment_date: string;
    purchase_token: string;
    subscription_status: string;
  };
  credits?: {
    total: number;
    used: number;
    remaining: number;
    free_credits: number;
  };
  total_searches: number;
  feedback?: {
    rating: number;
    content: string;
    user_name: string;
    submitted_at: string;
  };
} 