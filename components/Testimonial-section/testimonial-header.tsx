'use client';

import { useTranslation } from "react-i18next";

export default function TestimonialHeader() {
    const { t } = useTranslation();
    return (
        <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold 
                          text-primary-500 dark:text-primary-400 mb-4">
            {t('testimonials.title')}
        </h2>
        <p className="body-regular text-text-light-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
        </p>
    </div>
    );
}