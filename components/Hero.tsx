"use client";

import { Calendar, Phone, TrendingUp, Zap, Target } from "lucide-react";
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
      icon: Phone,
      value: "24/7",
      label: "AI answers your calls around the clock",
    },
    {
      icon: Target,
      value: "100%",
      label: "Of calls answered, zero missed",
    },
    {
      icon: TrendingUp,
      value: "3x",
      label: "More jobs booked vs voicemail",
    },
    {
      icon: Zap,
      value: "<2s",
      label: "Average answer time",
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
              <Phone className="h-4 w-4" />
              For Home Services Businesses
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Never Miss a{" "}
              <span className="text-primary-600">Customer Call</span> Again
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              AI-powered phone answering for landscapers, contractors, and
              home services pros. Answer every call, book more jobs, and never
              lose a customer to voicemail again.
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
                className="gap-2 text-black border-slate-300 hover:bg-slate-100 hover:text-black"
              >
                <Zap className="h-5 w-5" />
                Try AI Demo Live
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Setup in 15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>No contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Call Dashboard
              </div>

              {/* Dashboard mockup */}
              <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-slate-900">Today's Calls</div>
                  <div className="text-sm text-primary-600 font-medium">+12 answered</div>
                </div>

                {/* Call list preview */}
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Sarah Johnson</div>
                      <div className="text-xs text-slate-500">Lawn mowing quote • 2 min ago</div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Booked</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Mike Thompson</div>
                      <div className="text-xs text-slate-500">Tree trimming • 15 min ago</div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Callback</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Emily Chen</div>
                      <div className="text-xs text-slate-500">Landscape design • 1 hr ago</div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Booked</div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-900">47</div>
                    <div className="text-xs text-slate-500">Calls Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600">12</div>
                    <div className="text-xs text-slate-500">Jobs Booked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent-600">0</div>
                    <div className="text-xs text-slate-500">Missed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-accent-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
              AI-Powered Receptionist
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
