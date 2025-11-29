import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Receptionist for Landscaping Companies | Never Miss A Lead",
  description: "24/7 AI phone answering service for landscaping businesses. Book more estimates, capture more leads, and grow revenue. Setup in 48 hours. Try it free.",
  keywords: "landscaping ai, lawn care receptionist, landscape business phone service, ai answering service",
  openGraph: {
    title: "AI Receptionist for Landscaping Companies",
    description: "24/7 AI phone answering that books estimates and captures leads automatically",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Receptionist for Landscaping Companies",
    description: "24/7 AI phone answering that books estimates and captures leads automatically",
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
      </body>
    </html>
  );
}
