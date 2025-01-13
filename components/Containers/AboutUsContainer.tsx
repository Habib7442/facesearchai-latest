"use client"
import { motion } from "framer-motion";

import { Shield, Search, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";



const features = [
    {
      icon: Shield,
      title: "Advanced Face Check ID",
      description: "Leading the industry in facial recognition technology, our platform offers secure and accurate face check ID verification similar to PimEyes."
    },
    {
      icon: Search,
      title: "Powerful Photo Search",
      description: "Our advanced image identification system rivals Lenso, processing millions of photos daily with state-of-the-art AI technology."
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Experience real-time facial recognition results with our powerful search engine, making Face Search the fastest solution in the market."
    },
    {
      icon: Users,
      title: "Global Recognition",
      description: "Join millions who trust our facial recognition technology for accurate image identification across the web."
    }
  ];
  
  const stats = [
    { value: "99.9%", label: "Face Recognition Accuracy" },
    { value: "50000+", label: "Daily Photo Searches" },
    { value: "10000+", label: "Verified Users" },
    { value: "50000+", label: "Images Analyzed" }
  ];

export default function AboutPageContainer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 
                         bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 
                         dark:from-gray-100 dark:via-gray-200 dark:to-gray-300
                         bg-clip-text text-transparent">
              Advanced Facial Recognition Technology
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Face Search AI stands at the forefront of facial recognition technology, combining the power of PimEyes-grade image identification with Lenso-inspired photo search capabilities. Our platform delivers precise face check ID verification and comprehensive photo search solutions for individuals and organizations worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/search">Try Face Search</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 
                         shadow-lg hover:shadow-xl transition-all duration-300
                         transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4
                             bg-blue-100 dark:bg-blue-900/50 rounded-xl
                             group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/50 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Trusted by Organizations Worldwide
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                From law enforcement agencies to private businesses, Face Search AI provides reliable 
                facial recognition solutions that meet the highest standards of accuracy and security.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}