"use client";

import { Calendar, Zap, DollarSign, CheckCircle } from "lucide-react";
import Button from "./ui/Button";

export default function FinalCTA() {
  const handleBookDemo = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
    window.open(calendlyUrl, "_blank");
  };

  const handleTryDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to Scale Your Lead Generation?
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Join 50+ agencies and SaaS companies using AI-powered outreach to close more deals
          </p>
        </div>

        {/* Main CTA */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <Button
            size="lg"
            variant="accent"
            onClick={handleBookDemo}
            className="text-xl px-12 py-6 shadow-2xl hover:shadow-accent-500/50 gap-3"
          >
            <Calendar className="h-6 w-6" />
            Book Strategy Call
          </Button>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Free lead sample included</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>No long-term contracts</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-400/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-primary-700 px-6 py-2 rounded-full text-primary-100 text-sm font-semibold">
              OR
            </span>
          </div>
        </div>

        {/* Alternative action */}
        <div className="text-center">
          <p className="text-xl text-primary-100 mb-6">
            Want to hear the AI first? Try our live demo:
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={handleTryDemo}
            className="gap-3 border-2 border-white text-white hover:bg-white hover:text-primary-700"
          >
            <Zap className="h-5 w-5" />
            Try AI Demo Now
          </Button>
        </div>

        {/* Bottom social proof */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">
              2M+
            </div>
            <div className="text-primary-100">
              Verified business contacts
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">
              85%
            </div>
            <div className="text-primary-100">
              Average contact rate
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">
              10x
            </div>
            <div className="text-primary-100">
              Average client ROI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
