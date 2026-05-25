import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "IEEE Computer Society MUJ | Innovation, Technology & Community",
  description:
    "IEEE Computer Society, Manipal University Jaipur — the largest technical society driving innovation through events, workshops, hackathons, and a vibrant tech community.",
  keywords: [
    "IEEE",
    "Computer Society",
    "MUJ",
    "Manipal University Jaipur",
    "tech community",
    "hackathons",
    "workshops",
    "coding",
  ],
  openGraph: {
    title: "IEEE Computer Society MUJ",
    description:
      "Advancing technology for humanity through innovation, education, and collaboration at Manipal University Jaipur.",
    url: "https://ieeecsmuj.com",
    siteName: "IEEE CS MUJ",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE Computer Society MUJ",
    description:
      "Advancing technology for humanity through innovation, education, and collaboration.",
  },
  metadataBase: new URL("https://ieeecsmuj.com"),
};

import Preloader from "@/components/common/Preloader";
import { LoadingProvider } from "@/context/LoadingContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} ${cormorant.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <LoadingProvider>
          <Preloader />
          <Navbar />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </LoadingProvider>
      </body>
    </html>
  );
}