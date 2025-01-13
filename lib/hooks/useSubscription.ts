import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SubscriptionPlan {
  plan_id: string;
  priceId: string;
  planName: string;
  price: string;
}

export function useSubscription() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const initializeSubscription = async (plan: SubscriptionPlan) => {
    try {
      setLoadingPlan(plan.priceId);

      const response = await fetch("/api/payment/subscriptions/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_id: plan.plan_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === "Unauthorized") {
          router.push("/sign-in");
          throw new Error("Please sign in to continue");
        }
        throw new Error(error.error || "Failed to create checkout session");
      }

      const data = await response.json();

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process subscription"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return {
    loadingPlan,
    initializeSubscription,
  };
} 