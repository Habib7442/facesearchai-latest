import { useState, useEffect } from 'react';
import {toast} from 'sonner';

interface PlanData {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  credits: number | null;
  features: string;
}

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        setError('Unable to load pricing plans');
        toast('Unable to load pricing plans. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, isLoading, error };
}; 