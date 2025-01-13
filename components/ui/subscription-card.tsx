"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface SubscriptionCardProps {
  subscription?: {
    status: boolean;
    expiryDate: Date;
    lastPaymentDate: Date;
  };
}

const getStatusColor = (isPremium: boolean): string => {
  return isPremium 
    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
    : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading subscription information...</p>
        </CardContent>
      </Card>
    );
  }

  const statusColor = getStatusColor(subscription.status);
  const status = subscription.status ? 'Premium' : 'Free';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Subscription Status
          {subscription.status && <Crown className="h-5 w-5 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Plan</span>
          <Badge className={statusColor}>
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Expiry Date</span>
            <p className="font-medium">{formatDate(subscription.expiryDate)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Last Payment</span>
            <p className="font-medium">{formatDate(subscription.lastPaymentDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 