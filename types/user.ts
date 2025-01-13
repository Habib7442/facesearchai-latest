export interface UserCredits {
  total: number
  used: number
  remaining: number
  free_credits: number
}

export interface UserSubscription {
  plan_id: string
  premium_status: boolean
  expiry_date: string
}

export interface UserFeedback {
  rating: number
  content: string
  user_name: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string | null
  profile_url: string | null
  platform: string
  is_verified: boolean
  is_active: boolean
  is_locked: boolean
  locked_at: string | null
  failed_attempts: number
  fcm_token: string
  gsheet_link: string
  total_searches: number
  credits: UserCredits
  subscription: UserSubscription
  feedback: UserFeedback
} 