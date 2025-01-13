"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PurchaseButtonProps {
  planId: string;
  className?: string;
}

export function PurchaseButton({ planId, className }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/payment/subscriptions/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan_id: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process purchase');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to checkout...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Purchase Now
        </>
      )}
    </Button>
  );
} 