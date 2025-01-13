import { ReactNode } from "react";
import { Cpu, Search, ShieldCheck, PhoneCall, Users, Shield, Target, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
}
//hero-section
export const Features = (lng: string) => {
  const { t } = useTranslation();
  
  return [
    {
      id: 1,
      title: t('features.1.title'),
      description: t('features.1.description'),
      icon: <Cpu className="w-6 h-6" />,
      bgColor: "bg-secondary",
    },
    {
      id: 2,
      title: t('features.2.title'),
      description: t('features.2.description'),
      icon: <Search className=" w-6 h-6" />,
      bgColor: "bg-secondary",
    },
    {
      id: 3,
      title: t('features.3.title'),
      description: t('features.3.description'),
      icon: <ShieldCheck className=" w-6 h-6" />,
      bgColor: "bg-secondary",
    },
    {
      id: 4,
      title: t('features.4.title'),
      description: t('features.4.description'),
      icon: <PhoneCall className=" w-6 h-6" />,
      bgColor: "bg-secondary",
    },
  ];
};

//about-section

export const useAboutStats = (lng: string) => {
  const { t } = useTranslation();
  
  return [
    {
      icon: <Users className="w-6 h-6" />,
      value: t('about.stats.users.value'),
      label: t('about.stats.users.label')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      value: t('about.stats.security.value'),
      label: t('about.stats.security.label')
    },
    {
      icon: <Target className="w-6 h-6" />,
      value: t('about.stats.accuracy.value'),
      label: t('about.stats.accuracy.label')
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: t('about.stats.rating.value'),
      label: t('about.stats.rating.label')
    }
  ];
};

export const useAboutFeatures = (lng: string) => {
  const { t } = useTranslation();
  
  return [
    {
      title: t('about.features.ai.title'),
      description: t('about.features.ai.description'),
    },
    {
      title: t('about.features.privacy.title'),
      description: t('about.features.privacy.description'),
    },
    {
      title: t('about.features.database.title'),
      description: t('about.features.database.description'),
    },
    {
      title: t('about.features.analysis.title'),
      description: t('about.features.analysis.description'),
    },
  ];
};

export const aboutUsImages = [
  {
    id: 1,
    src: "/about-us/image3.jpg",
    alt: "About Us Image"
  },
];

export const logo = [
  {
    id: 1,
    src: "/facesearch-logo.png",
    alt: "Face Search Logo"
  },
];

export const badges = [
  {
    id: 1,
    src: "/badges/google-badge.png",
    alt: "google-badge",
    href: "https://play.google.com/store/apps/details?id=com.facesearch.app"
  },
  {
    id: 2,
    src: "/badges/apple-badge.png",
    alt: "apple-badge",
    href: "https://apps.apple.com/us/app/face-search-ai-pimeyes/id6504996249"
  },
];

export const placeholderImage = "/placeholder-image.svg";


