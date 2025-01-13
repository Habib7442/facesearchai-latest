"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PricingCards from "./pricing-cards";
import Balancer from "react-wrap-balancer";

import {toast} from "sonner";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { usePricingPlans } from "../../lib/hooks/usePricingPlans";
import { useTranslation } from 'react-i18next';
import { selectUser } from "@/store/slices/userSlice";
import { useSubscription } from '@/lib/hooks/useSubscription';

const PricingSection = () => {
  const [showBusinessPlans, setShowBusinessPlans] = useState(false);
  const { loadingPlan, initializeSubscription } = useSubscription();
  const { isLoading } = usePricingPlans();
  const user = useSelector(selectUser);
  const router = useRouter();
  const { t } = useTranslation();



  const pricingPlans = [
    {
      id: "basic-starter-plan",
      plan_id: "basic_plan",
      name: t('pricing.plans.basic.title'),
      price: "$7.77",
      period: "month",
      description: t('pricing.plans.basic.description'),
      features: t('pricing.features.basic', { returnObjects: true }),
      highlighted: false,
      buttonText: "Get Basic",
      stripePriceId: "price_1QZPEhSABw0Heq1mePn4WEfN",
      isFixed: true,
    },
    {
      id: "premium-plan",
      plan_id: "premium_plan",
      name: t('pricing.plans.premium.title'),
      price: "$19.99",
      period: "month",
      description: t('pricing.plans.premium.description'),
      features: t('pricing.features.premium', { returnObjects: true }),
      highlighted: true,
      buttonText: "Get Premium",
      stripePriceId: "price_1QZPHYSABw0Heq1mYLxaYU60",
      badge: "Most Popular",
    },
    {
      id: "professional-plan",
      plan_id: "professional_plan",
      name: t('pricing.plans.professional.title'),
      price: "$39.99",
      period: "month",
      description: t('pricing.plans.professional.description'),
      features: t('pricing.features.professional', { returnObjects: true }),
      highlighted: false,
      buttonText: "Get Professional",
      stripePriceId: "price_1QZPISSABw0Heq1mNPwXyUtK",
    },
    {
      id: "business-plan",
      plan_id: "business_plan",
      name: t('pricing.plans.business.title'),
      price: "$99.99",
      period: "month",
      description: t('pricing.plans.business.description'),
      features: t('pricing.features.business', { returnObjects: true }),
      highlighted: true,
      buttonText: "Get Business",
      stripePriceId: "price_1QZPKFSABw0Heq1mUWLsSIu6",
      badge: "Best Value",
    },
    {
      id: "enterprise-plan",
      plan_id: "enterprise_plan",
      name: t('pricing.plans.enterprise.title'),
      price: "Custom",
      period: "month",
      description: t('pricing.plans.enterprise.description'),
      features: t('pricing.features.enterprise', { returnObjects: true }),
      highlighted: false,
      buttonText: "Contact Us",
      stripePriceId: "price_1EnterprisePlan",
    },
  ];

  const basicPlan = pricingPlans.find(
    (plan) => plan.id === "basic-starter-plan"
  );

  const individualPlans = pricingPlans.filter(
    (plan) =>
      !plan.isFixed && ["premium-plan", "professional-plan"].includes(plan.id)
  );

  const businessPlans = pricingPlans.filter(
    (plan) =>
      !plan.isFixed && ["business-plan", "enterprise-plan"].includes(plan.id)
  );

  const handlePurchase = async (plan: {
    priceId: string;
    planName: string;
    price: string;
    plan_id?: string;
  }) => {
    if (user?.success === false) {
      toast("Please sign in to continue");
      router.push("/sign-in");
      return;
    }

    await initializeSubscription(plan);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mb-4 container mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10 
                        mb-8 sm:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold 
                          text-primary-500 dark:text-primary-400">
              {t('pricing.title')}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto 
                         text-text-light-secondary dark:text-text-dark-secondary">
              <Balancer>{t('pricing.description')}</Balancer>
            </p>
          </motion.div>

          {/* Plan Type Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-3"
          >
            <span
              className={`small-medium ${
                !showBusinessPlans
                  ? "text-text-light-primary dark:text-text-dark-primary"
                  : "text-text-light-secondary dark:text-text-dark-secondary"
              }`}
            >
              {t('pricing.toggle.individual')}
            </span>
            <button
              onClick={() => setShowBusinessPlans(!showBusinessPlans)}
              type="button"
              role="switch"
              aria-checked={showBusinessPlans}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none
                ${
                  showBusinessPlans
                    ? "bg-primary-500 dark:bg-primary-400"
                    : "bg-primary-100 dark:bg-primary-300"
                }
              `}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full 
                  bg-surface-light-base dark:bg-surface-dark-base shadow-lg ring-0 
                  transition duration-200 ease-in-out
                  ${showBusinessPlans ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </button>
            <span
              className={`small-medium ${
                showBusinessPlans
                  ? "text-text-light-primary dark:text-text-dark-primary"
                  : "text-text-light-secondary dark:text-text-dark-secondary"
              }`}
            >
              {t('pricing.toggle.business')}
            </span>
          </motion.div>
        </div>

        {/* Plans Display */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                          gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            {showBusinessPlans ? (
              // Business & Enterprise Plans
              <>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[basicPlan!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[businessPlans.find((p) => p.highlighted)!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[businessPlans.find((p) => !p.highlighted)!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
              </>
            ) : (
              // Individual & Professional Plans
              <>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[basicPlan!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[individualPlans.find((p) => p.highlighted)!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
                <div className="w-full">
                  <PricingCards
                    pricingPlans={[individualPlans.find((p) => !p.highlighted)!]}
                    handlePurchase={handlePurchase}
                    loadingPlan={loadingPlan}
                    isLoaded={!isLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
