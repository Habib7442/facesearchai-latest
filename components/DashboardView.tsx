"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Loader2, Search, CreditCard, Star, User, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/lib/i18n/i18n";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export function DashboardView() {
  const { t } = useTranslation("common");
  const [sessionTime, setSessionTime] = useState<string>("");

  // Initialize i18next
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  const { data: profile, error, isLoading } = useSWR("/api/profile", fetcher);
  const { data: sessionData } = useSWR("/api/auth/session", fetcher, {
    refreshInterval: 1000, // Check session every second
  });

  useEffect(() => {
    if (sessionData?.session?.expiresAt) {
      const timer = setInterval(() => {
        const now = Date.now() / 1000; // Convert to seconds
        const timeLeft = sessionData.session.expiresAt - now;

        if (timeLeft <= 0) {
          setSessionTime("Expired");
          clearInterval(timer);
        } else {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = Math.floor(timeLeft % 60);
          setSessionTime(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sessionData]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <p className="text-destructive">Error loading dashboard data</p>
        </Card>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Session Timer */}
        {sessionTime && (
          <div className="fixed top-4 right-4 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 backdrop-blur-sm rounded-full px-3 py-1.5 
                     flex items-center gap-2 text-sm font-medium text-primary shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Session: {sessionTime}</span>
            </motion.div>
          </div>
        )}
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-none">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("dashboard.welcome", { name: profile.name || "User" })}
            </h1>
            <p className="text-muted-foreground">{t("dashboard.overview")}</p>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Searches */}
          <StatsCard
            title={t("dashboard.stats.searches")}
            value={profile.total_searches || 0}
            bgColor="from-blue-500/10 to-blue-500/5"
            icon="search"
          />

          {/* Credits */}
          <StatsCard
            title={t("dashboard.stats.credits")}
            value={profile.credits?.remaining || 0}
            subtext={`${profile.credits?.used || 0} used of ${
              profile.credits?.total || 0
            }`}
            bgColor="from-green-500/10 to-green-500/5"
            icon="creditCard"
          />

          {/* Subscription Status */}
          <StatsCard
            title={t("dashboard.stats.subscription")}
            value={profile.subscription?.premium_status ? "Premium" : "Free"}
            subtext={
              profile.subscription?.expiry_date
                ? `Expires: ${new Date(
                    profile.subscription.expiry_date
                  ).toLocaleDateString()}`
                : undefined
            }
            bgColor="from-purple-500/10 to-purple-500/5"
            icon="star"
          />

          {/* Account Status */}
          <StatsCard
            title={t("dashboard.stats.account")}
            value={profile.is_active ? "Active" : "Inactive"}
            subtext={profile.is_verified ? "Verified Account" : "Unverified"}
            bgColor="from-yellow-500/10 to-yellow-500/5"
            icon="user"
          />
        </div>

        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("dashboard.usage.title")}
            </h2>
            <div className="space-y-4">
              {/* Credits Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("dashboard.usage.credits")}
                  </span>
                  <span className="font-medium">
                    {Math.round(
                      (profile.credits?.used / profile.credits?.total) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (profile.credits?.used / profile.credits?.total) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.usage.remaining")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {profile.credits?.remaining || 0}
                  </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.usage.searches")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {profile.total_searches || 0}
                  </p>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  bgColor: string;
  icon: "search" | "creditCard" | "star" | "user";
}

function StatsCard({ title, value, subtext, bgColor, icon }: StatsCardProps) {
  const icons = {
    search: <Search className="w-4 h-4 text-primary" />,
    creditCard: <CreditCard className="w-4 h-4 text-primary" />,
    star: <Star className="w-4 h-4 text-primary" />,
    user: <User className="w-4 h-4 text-primary" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`h-full p-6 bg-gradient-to-br ${bgColor} transition-all duration-300 hover:shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-2">
          {icons[icon]}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtext && (
          <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
        )}
      </Card>
    </motion.div>
  );
}
