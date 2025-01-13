"use client";

import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
  XIcon,
} from "lucide-react";
import { IconBrandTelegram, IconBrandTiktok } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "./ui/Logo";

const FooterSection = () => {
  const { t } = useTranslation('common');

  const quickLinks = [
    { label: t('footer.company.about'), href: '/about' },
    { label: t('footer.product.pricing'), href: '/pricing' },
    { label: t('footer.legal.privacy'), href: '/privacy' },
  ];

  const legalLinks = [
    { label: t('footer.legal.privacy'), href: '/privacy' },
    { label: t('footer.legal.terms'), href: '/terms' },
    { label: t('footer.legal.cookies'), href: '/cookies' },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-xl">
      {/* Main Content */}
      <div className="mx-auto max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 lg:p-12 relative">
          {/* Company Info Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="transform-gpu origin-left scale-110">
              <Logo />
            </div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('footer.company.description')}
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: IconBrandTiktok, href: "https://www.tiktok.com/@facesearchai/video/7432635005890743595", label: "TikTok" },
                { icon: Linkedin, href: "https://www.linkedin.com/feed/update/urn:li:activity:7258436636349235201", label: "LinkedIn" },
                { icon: XIcon, href: "https://twitter.com/FacesearchAI/status/1852667105914609805", label: "X (Twitter)" },
                { icon: Facebook, href: "https://www.facebook.com/reel/1782310318840217", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/reel/DB3dz_zoKqG/", label: "Instagram" },
                { icon: Youtube, href: "https://www.youtube.com/shorts/6ftL04hu0u0", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40
                           hover:from-white/90 hover:to-white/50 dark:hover:from-gray-700/90 dark:hover:to-gray-700/50
                           text-gray-700 dark:text-gray-200 transition-all duration-300 hover:scale-110
                           backdrop-blur-md shadow-sm border border-blue-100/50 dark:border-blue-900/30"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Quick Links Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300
                             bg-clip-text text-transparent">
                  {t('footer.quickLinks')}
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group flex items-center text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300
                             bg-clip-text text-transparent">
                  {t('footer.support.title')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 group">
                    <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <a href="mailto:support@facesearch.com" 
                       className="text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {t('footer.support.contact')}
                    </a>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <IconBrandTelegram className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <a href="https://t.me/facesearchaibot" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {t('footer.support.telegram')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Download App Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300
                             bg-clip-text text-transparent">
                  {t('footer.download.title')}
                </h3>
                <div className="flex flex-col gap-3">
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.facesearch.app"
                    target="_blank"
                    className="group relative w-36 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 
                                  group-hover:from-black/15 group-hover:to-black/10 dark:group-hover:from-white/15 dark:group-hover:to-white/10 
                                  transition-all duration-300" />
                    <Image
                      src="/google-badge.png"
                      alt="Google Play Store"
                      width={180}
                      height={70}
                      className="shadow-sm"
                    />
                  </Link>
                  <Link
                    href="https://apps.apple.com/us/app/face-search-ai-pimeyes/id6504996249"
                    target="_blank"
                    className="group relative w-36 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 
                                  group-hover:from-black/15 group-hover:to-black/10 dark:group-hover:from-white/15 dark:group-hover:to-white/10 
                                  transition-all duration-300" />
                    <Image
                      src="/apple-badge.svg"
                      alt="Apple App Store"
                      width={180}
                      height={70}
                      className=" shadow-sm"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-100/50 dark:border-blue-900/30 
                     bg-gradient-to-b from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 
                     backdrop-blur-md">
        <div className="mx-auto max-w-full">
          <div className="py-6 px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                {t('footer.copyright')}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {legalLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;