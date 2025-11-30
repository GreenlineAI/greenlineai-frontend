"use client";

import { Calendar, Database, TrendingUp, Users, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  const handleBookDemo = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
    window.open(calendlyUrl, "_blank");
  };

  const handleTryDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    {
      icon: Database,
      value: "2M+",
      label: "Home services businesses in database",
    },
    {
      icon: Target,
      value: "85%",
      label: "Average contact rate on our leads",
    },
    {
      icon: TrendingUp,
      value: "3x",
      label: "Higher conversion vs cold lists",
    },
    {
      icon: Zap,
      value: "24hr",
      label: "Lead delivery turnaround",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              For Marketing Agencies & SaaS Companies
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Sell More to{" "}
              <span className="text-primary-600">Home Services</span> Businesses
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Pre-qualified leads, done-for-you outreach, or white-label our
              AI sales platform. Help your clients close more deals with
              verified landscaping and home services prospects.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                variant="default"
                onClick={handleBookDemo}
                className="gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book a Strategy Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleTryDemo}
                className="gap-2 text-slate-900 border-slate-300 hover:bg-slate-100"
              >
                <Zap className="h-5 w-5" />
                Try AI Demo Live
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Pay per lead or monthly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>White-label available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>TCPA compliant</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Lead Dashboard
              </div>

              {/* Dashboard mockup */}
              <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-slate-900">Today's Leads</div>
                  <div className="text-sm text-primary-600 font-medium">+24 new</div>
                </div>

                {/* Lead list preview */}
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Green Valley Landscaping</div>
                      <div className="text-xs text-slate-500">Austin, TX • 3.2 rating • No website</div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Hot</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Premier Lawn Care</div>
                      <div className="text-xs text-slate-500">Dallas, TX • 2.8 rating • Outdated site</div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Warm</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Sunrise Garden Services</div>
                      <div className="text-xs text-slate-500">Houston, TX • 3.5 rating • No CRM</div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Hot</div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">847</div>
                    <div className="text-xs text-slate-500">Total Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600">312</div>
                    <div className="text-xs text-slate-500">Contacted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent-600">47</div>
                    <div className="text-xs text-slate-500">Meetings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-accent-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
              AI-Powered Outreach
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
