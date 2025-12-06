"use client";

import { ArrowLeft, Calendar, Headphones, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RetellDemo from "@/components/RetellDemo";

export default function VoiceDemoPage() {
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";

  const handleBookDemo = () => {
    window.open(calendlyUrl, "_blank");
  };

  const suggestedQuestions = [
    "What kind of leads do you have for home services?",
    "How does your done-for-you outreach work?",
    "Can you tell me about pricing?",
    "What industries do you cover?",
    "How are your leads verified?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Headphones className="h-4 w-4" />
              AI Voice Demo
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Talk to Our AI Sales Assistant
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Have questions about our lead generation services? Talk directly
              to our AI assistant. Ask about pricing, lead quality, or how our
              done-for-you outreach works.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Live AI Demo */}
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 md:p-12">
                <RetellDemo />
              </Card>

              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> This AI assistant can answer your
                  questions about GreenLine AI services, lead pricing, and help
                  you understand if we&apos;re a good fit for your agency.
                </p>
              </div>
            </div>

            {/* Right: Suggested questions */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-accent-500" />
                Try Asking
              </h2>

              <div className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border-white/20 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-white font-medium pt-0.5">{question}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary-600/20 to-accent-500/20 border border-white/10 rounded-xl">
                <h3 className="text-xl font-bold mb-3">
                  Prefer to Talk to a Human?
                </h3>
                <p className="text-slate-300 mb-4">
                  Book a quick strategy call with our team. We&apos;ll show you
                  exactly how many leads are available in your target market.
                </p>
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleBookDemo}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Calendar className="h-5 w-5" />
                  Book Strategy Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} GreenLine AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
