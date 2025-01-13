"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PricingCardsProps {
  pricingPlans: Array<{
    id: string;
    plan_id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    buttonText: string;
    badge?: string;
    isFixed?: boolean;
    stripePriceId: string;
  }>;
  handlePurchase: (plan: {
    priceId: string;
    planName: string;
    price: string;
    plan_id: string;
  }) => void;
  loadingPlan: string | null;
  isLoaded: boolean;
}

const formatPrice = (price: string) => {
  if (price === 'Custom') return price;
  const numericPrice = parseFloat(price.replace('$', ''));
  
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold">${numericPrice.toFixed(2)}</div>
    </div>
  );
};

const PricingCard = ({ plan, handlePurchase, loadingPlan, isLoaded }: any) => {
  return (
    <div
      className={cn(
        "relative rounded-[20px] transition-all duration-300",
        "w-full h-full flex flex-col justify-between",
        "p-4 sm:p-6 lg:p-8 xl:p-10",
        "border border-border-light dark:border-border-dark",
        plan.highlighted ? 
          "lg:scale-105 z-10 border-primary-500 dark:border-primary-400" : 
          "hover:border-primary-400 dark:hover:border-primary-300"
      )}
    >
      {/* Badge - Positioned above the card */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium 
                         bg-primary-500/90 text-white shadow-lg">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="flex flex-col h-full">
        {/* Plan Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
            {plan.name}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg mb-4 line-clamp-2 
                       text-text-light-secondary dark:text-text-dark-secondary">
            {plan.description}
          </p>
          <div className="flex items-end justify-center gap-1">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {formatPrice(plan.price)}
            </span>
            <span className="text-sm sm:text-base lg:text-lg text-text-light-secondary 
                            dark:text-text-dark-secondary mb-1">
              /{plan.period}
            </span>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 sm:space-y-4 mb-6 flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 dark:text-primary-400 
                          flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm sm:text-base lg:text-lg">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button
          onClick={() => handlePurchase({
            priceId: plan.stripePriceId,
            planName: plan.name,
            price: plan.price,
            plan_id: plan.plan_id
          })}
          disabled={!isLoaded || loadingPlan === plan.id}
          className={cn(
            "w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl",
            "text-sm sm:text-base lg:text-lg font-medium",
            "transition-all duration-300",
            plan.highlighted ? "btn-primary" : "btn-secondary text-gray-100",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loadingPlan === plan.id ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            plan.buttonText
          )}
        </Button>
      </div>
    </div>
  );
};

const PricingCards = ({
  pricingPlans,
  handlePurchase,
  loadingPlan,
  isLoaded,
}: PricingCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 w-full h-full">
      {pricingPlans.map((plan) => (
        <div key={plan.id} className="h-full">
          <PricingCard
            plan={plan}
            handlePurchase={handlePurchase}
            loadingPlan={loadingPlan}
            isLoaded={isLoaded}
          />
        </div>
      ))}
    </div>
  );
};

export default PricingCards;
