"use client"

import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Crown, 
  Clock, 
  Shield as ShieldIcon, 
  Wallet, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Loader2,
  User,
  Search as SearchIcon
} from "lucide-react"
import { AvatarImage } from "@radix-ui/react-avatar"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next'

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
})

export function ProfileContent() {
  const { t } = useTranslation()
  
  const { data: profile, error, isLoading } = useSWR('/api/profile', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  if (error) {
    return (
      <div className="container max-w-6xl py-8">
        <Card className="p-6">
          <p className="text-destructive">Error loading profile data</p>
        </Card>
      </div>
    )
  }

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const statsCards = [
    {
      title: t('profile.stats.subscription.title'),
      icon: Crown,
      bgColor: "from-yellow-50 to-yellow-100/50 dark:from-yellow-900/10 dark:to-yellow-900/5",
      hoverColor: "hover:from-yellow-100 hover:to-yellow-200/50 dark:hover:from-yellow-900/20 dark:hover:to-yellow-900/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      content: (
        <div className="space-y-2">
          <Badge variant={profile.subscription?.premium_status ? "default" : "secondary"}>
            {profile.subscription?.premium_status ? 'Premium' : 'Free'}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Plan: {profile.subscription?.plan_id || 'No Plan'}
          </p>
        </div>
      ),
    },
    {
      title: t('profile.stats.expiry.title'),
      icon: CalendarIcon,
      bgColor: "from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5",
      hoverColor: "hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-blue-900/20 dark:hover:to-blue-900/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      content: (
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {format(new Date(profile.subscription?.expiry_date || Date.now()), 'MMM dd, yyyy')}
          </div>
          <p className="text-xs text-muted-foreground">
            Status: {profile.subscription?.subscription_status || 'N/A'}
          </p>
        </div>
      ),
    },
    {
      title: t('profile.stats.credits.title'),
      icon: Wallet,
      bgColor: "from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/5",
      hoverColor: "hover:from-green-100 hover:to-green-200/50 dark:hover:from-green-900/20 dark:hover:to-green-900/10",
      iconColor: "text-green-600 dark:text-green-400",
      content: (
        <div className="space-y-1">
          <div className="text-2xl font-bold">{profile.credits?.remaining || 0}</div>
          <p className="text-xs text-muted-foreground">
            Used: {profile.credits?.used || 0} / Total: {profile.credits?.total || 0}
          </p>
        </div>
      ),
    },
    {
      title: t('profile.stats.searches.title'),
      icon: SearchIcon,
      bgColor: "from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/5",
      hoverColor: "hover:from-purple-100 hover:to-purple-200/50 dark:hover:from-purple-900/20 dark:hover:to-purple-900/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      content: (
        <div className="space-y-1">
          <div className="text-2xl font-bold">{profile.total_searches || 0}</div>
          <p className="text-xs text-muted-foreground">Total Searches</p>
        </div>
      ),
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl py-8 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/5 via-primary/3 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-32 w-32 ring-4 ring-primary/10 dark:ring-primary/20">
                    <AvatarImage 
                      src={profile.profile_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`} 
                    />
                    <AvatarFallback className="bg-primary/5 text-primary text-2xl">
                      {profile.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                        {profile.name}
                      </h1>
                      {profile.is_verified && (
                        <Badge variant="secondary" className="gap-1">
                          <ShieldIcon className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                  {profile.phone && (
                    <p className="text-sm text-muted-foreground">
                      📞 {profile.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "group transition-all duration-300 cursor-pointer overflow-hidden",
                  "hover:shadow-lg hover:-translate-y-1",
                  "bg-gradient-to-br",
                  stat.bgColor,
                  stat.hoverColor
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={cn("h-4 w-4 transition-colors", stat.iconColor)} />
                </CardHeader>
                <CardContent>
                  {stat.content}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className={cn("h-4 w-4", stat.iconColor)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 