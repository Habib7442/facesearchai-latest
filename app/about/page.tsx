import AboutPageContainer from "@/components/Containers/AboutUsContainer";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'
export const revalidate = 0


// SEO metadata
export const metadata: Metadata = {
  title: "About Face Search AI | Advanced Facial Recognition Technology",
  description: "Learn about Face Search AI's advanced facial recognition and photo search technology. Trusted by millions for secure image identification and face check ID verification.",
  keywords: "pimeyes, Face Search, Photo Search, image identification, facial recognition, face check id, lenso",
  openGraph: {
    title: "About Face Search AI | Advanced Facial Recognition Technology",
    description: "Discover how Face Search AI is revolutionizing facial recognition and photo search technology with advanced AI and secure image identification.",
    images: ["/about-hero.jpg"],
  },
};





export default function AboutPage() {
  return <AboutPageContainer />
}