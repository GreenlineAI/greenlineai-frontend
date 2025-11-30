"use client";

import { Calendar, CheckCircle, ArrowRight, Headphones, Database, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Demo() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";

  const handleBookDemo = () => {
    window.open(calendlyUrl, "_blank");
  };

  const leadFeatures = [
    {
      icon: Database,
      title: "Fresh Data",
      description: "Every lead verified within the last 7 days",
    },
    {
      icon: Shield,
      title: "100% Verified",
      description: "Phone, email, and business info confirmed",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Get leads in your inbox within 24 hours",
    },
  ];

  const sampleLeadFields = [
    "Business Name",
    "Owner Name",
    "Phone Number",
    "Email Address",
    "Business Address",
    "Years in Business",
    "Service Area",
    "Current Marketing Spend",
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Database className="h-4 w-4" />
            Premium Lead Data
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See What You Get
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Every lead comes with verified contact information and business details.
            No more bounced emails or disconnected numbers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Sample Lead Preview */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Sample Lead Data</h3>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Verified
                </span>
              </div>

              <div className="space-y-3">
                {sampleLeadFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                  >
                    <span className="text-slate-300">{field}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-slate-400 text-center">
                  Book a call to see real lead samples for your target market
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Lead Features + CTA */}
          <div>
            <div className="space-y-6 mb-8">
              {leadFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{feature.title}</h4>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-accent-500/20 border border-accent-500/30 rounded-xl mb-6">
              <p className="text-accent-200 text-sm font-semibold mb-2">
                WHY OUR LEADS CONVERT BETTER
              </p>
              <p className="text-white">
                We verify every contact within 7 days of delivery. If a lead bounces,
                we replace it free. That&apos;s our data quality guarantee.
              </p>
            </div>

            {/* Voice Demo Link */}
            <Link
              href="/demo/voice"
              className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium">Have questions?</p>
                  <p className="text-sm text-slate-400">Talk to our AI assistant</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Bottom section - Sales Funnel CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-600/20 to-accent-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Scale Your Client Acquisition?
                </h3>
                <p className="text-slate-300 mb-6">
                  Book a 15-minute strategy call. We&apos;ll show you exactly how many
                  leads are available in your target market and send you a free sample.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={handleBookDemo}
                    className="gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Strategy Call
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                    className="gap-2 border-white/30 text-white hover:bg-white/10"
                  >
                    View Pricing
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">15 min</div>
                  <div className="text-sm text-slate-300">Quick call</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">Free</div>
                  <div className="text-sm text-slate-300">Lead sample</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">Custom</div>
                  <div className="text-sm text-slate-300">Market analysis</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">No</div>
                  <div className="text-sm text-slate-300">Obligation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">85%</div>
            <div className="text-slate-300">
              Contact rate on our leads
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">7 days</div>
            <div className="text-slate-300">
              Maximum data age
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">3x</div>
            <div className="text-slate-300">
              Higher conversion vs cold lists
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
