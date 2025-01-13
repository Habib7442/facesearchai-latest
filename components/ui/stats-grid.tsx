"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CreditCard, Crown } from "lucide-react";

interface StatsGridProps {
  data: {
    searches: number;
    credits: {
      used: number;
      remaining: number;
      total: number;
    };
    subscription: {
      status: boolean;
      expiryDate: Date;
      lastPaymentDate: Date;
    } | null;
  };
}

export function StatsGrid({ data }: StatsGridProps) {
  if (!data) {
    return <div>Loading stats...</div>;
  }

  const stats = [
    {
      title: "Total Searches",
      value: data.searches.toString(),
      icon: Search,
      description: "Total searches performed",
    },
    {
      title: "Credits",
      value: `${data.credits.remaining}/${data.credits.total}`,
      icon: CreditCard,
      description: `${data.credits.used} credits used`,
    },
    {
      title: "Subscription",
      value: data.subscription?.status ? "Premium" : "Free",
      icon: Crown,
      description: data.subscription?.status 
        ? `Expires: ${new Date(data.subscription.expiryDate).toLocaleDateString()}`
        : "Upgrade to Premium",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 