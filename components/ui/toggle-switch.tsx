"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  isChecked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ leftLabel, rightLabel, isChecked, onChange }: ToggleSwitchProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center justify-center space-x-3"
    >
      <span
        className={`small-medium ${
          !isChecked
            ? "text-text-light-primary dark:text-text-dark-primary"
            : "text-text-light-secondary dark:text-text-dark-secondary"
        }`}
      >
        {t("hero.upload.toggle.left")}
      </span>
      <button
        onClick={onChange}
        type="button"
        role="switch"
        aria-checked={isChecked}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none
          ${
            isChecked
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
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
      <span
        className={`small-medium ${
          isChecked
            ? "text-text-light-primary dark:text-text-dark-primary"
            : "text-text-light-secondary dark:text-text-dark-secondary"
        }`}
      >
        {t("hero.upload.toggle.right")}
      </span>
    </motion.div>
  );
} 