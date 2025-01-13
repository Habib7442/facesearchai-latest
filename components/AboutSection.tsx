"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { aboutUsImages, useAboutStats, useAboutFeatures } from "@/constants";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/i18n";

const AboutSection = () => {
  const { t } = useTranslation();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full
                         bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                         text-blue-600 dark:text-blue-400">
            {t("about.subtitle")}
          </span> */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                        text-primary-500 dark:text-primary-400 mb-4"
          >
            {t("about.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {useAboutStats(i18n.language).map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group p-6 rounded-2xl bg-white dark:bg-gray-800 
                         shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
                         hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
                         transform hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative z-10">
                <div
                  className="flex justify-center text-blue-600 dark:text-blue-400 mb-4 
                               group-hover:scale-110 transition-transform duration-300"
                >
                  {stat.icon}
                </div>
                <div
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100 
                               text-center mb-2"
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="grid grid-rows-2 gap-8 h-full">
            {" "}
            {/* Changed to grid with 2 rows */}
            {useAboutFeatures(i18n.language)
              .slice(0, 2)
              .map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-gray-800 
                 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
                 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
                 transform hover:-translate-y-1 transition-all duration-300
                 flex flex-col h-full" // Added flex and h-full
                >
                  <h3
                    className="text-xl font-semibold mb-3 
                   bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300
                   bg-clip-text text-transparent"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                    {" "}
                    {/* Added flex-grow */}
                    {feature.description}
                  </p>
                </motion.div>
              ))}
          </div>

          {/* Center Column - Main Image */}
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="relative h-full flex items-center" // Added flex and items-center
>
  <div className="w-full h-full relative rounded-2xl overflow-hidden
       shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50
       transform hover:scale-[1.02] transition-transform duration-500">
    <Image
      src={aboutUsImages[0].src}
      alt={aboutUsImages[0].alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>
</motion.div>

          {/* Right Column */}
          <div className="grid grid-rows-2 gap-8 h-full">
            {" "}
            {/* Changed to grid with 2 rows */}
            {useAboutFeatures(i18n.language)
              .slice(2)
              .map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-gray-800 
                 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
                 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
                 transform hover:-translate-y-1 transition-all duration-300
                 flex flex-col h-full" // Added flex and h-full
                >
                  <h3
                    className="text-xl font-semibold mb-3 
                   bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300
                   bg-clip-text text-transparent"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                    {" "}
                    {/* Added flex-grow */}
                    {feature.description}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
