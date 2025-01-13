"use client";

import { motion } from "framer-motion";

export const ScanningAnimation = () => {
    return (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent"
                initial={{ top: "0%" }}
                animate={{
                    top: ["0%", "100%", "0%"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute inset-0 border-2 border-indigo-400/50 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
};