import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VoiceDemoFab from "@/components/VoiceDemoFab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenLine AI | B2B Lead Generation for Home Services",
  description: "Pre-qualified leads, AI-powered outreach, and white-label solutions for marketing agencies and SaaS companies selling to home services businesses.",
  keywords: "b2b lead generation, home services leads, landscaping leads, ai sales, white label lead gen, marketing agency tools",
  openGraph: {
    title: "GreenLine AI | B2B Lead Generation Platform",
    description: "Pre-qualified home services leads and AI-powered outreach for marketing agencies",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenLine AI | B2B Lead Generation Platform",
    description: "Pre-qualified home services leads and AI-powered outreach for marketing agencies",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <VoiceDemoFab />
      </body>
    </html>
  );
}
