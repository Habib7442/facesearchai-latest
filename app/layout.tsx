import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@/components/analytics"
import { cn } from "@/lib/utils"
import { AuthProvider } from '@/contexts/auth-context'
import { LanguageProvider } from "@/lib/i18n/provider"
import { Providers } from './providers'
import { Navbar } from "@/components/Navigation/navbar"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { I18nProvider } from '@/components/providers/i18n-provider'
import { GoogleAuthHandler } from "@/components/ui/GoogleAuthHandler"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "FaceSearch AI",
    template: "%s | FaceSearch AI"
  },
  description: "Search for similar faces across the internet using AI",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'FaceSearch AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaceSearch AI',
    description: 'Search for similar faces across the internet using AI',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <I18nProvider>
          <Providers>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <LanguageProvider>
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1 pt-16">
                      {children}
                    </main>
                    <Toaster />
                    <Analytics />
                    <TailwindIndicator />
                  </div>
                </LanguageProvider>
              </ThemeProvider>
            </AuthProvider>
          </Providers>
        </I18nProvider>
        <GoogleAuthHandler />
      </body>
    </html>
  )
}