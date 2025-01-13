"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
    progress: number;
}

export const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => {
    return (
        <div className="w-full space-y-3">
            <Progress
                value={progress}
                className="h-3 bg-surface-light-paper dark:bg-surface-dark-paper rounded-full overflow-hidden"
            />
            <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary font-medium">
                    Processing image...
                </span>
                <span className="text-sm font-medium text-primary-500 dark:text-primary-400">
                    {progress}%
                </span>
            </motion.div>
        </div>
    );
};
