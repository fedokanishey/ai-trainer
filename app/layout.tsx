import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ConvexClerkProvider from '@/providers/ConvexClerkProvider'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "AI Trainer – Your Smart Personalized Fitness Coach",
  description:
    "AI Trainer is an intelligent fitness assistant that creates personalized workout plans, custom meal programs, and goal-based routines using advanced AI. Track your progress, improve your performance, and achieve your fitness goals with tailored recommendations designed specifically for your body, lifestyle, and training level.",

  openGraph: {
    title: "AI Trainer – Your Smart AI Fitness Coach",
    description:
      "Personalized workout and nutrition plans generated using advanced AI technology.",
    url: "https://ai-trainer-pi.vercel.app/",
    siteName: "AI Trainer",
    images: [
      {
        url: "/ai-trainer/public/OIF.png",
        width: 1200,
        height: 630,
        alt: "AI Trainer Preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Trainer – Your Smart AI Fitness Coach",
    description:
      "Create personalized fitness and nutrition plans with AI. Improve faster with tailored guidance.",
    images: ["/ai-trainer/public/OIF.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NavBar />
            <div className="fixed inset-0 -z-1">
              <div className="absolute inset-0 bg-linear-to-b from-background via-background to-background"></div>
              <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-size-[20px_20px]"></div>
            </div>
            <main className='pt-24 grow'>
            { children }
            </main>
          <Footer />
        </body>
      </html>
    </ConvexClerkProvider>
  )
}