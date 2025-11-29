"use client";

import { Phone, PlayCircle, TrendingUp, Clock, DollarSign, Zap } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Hero() {
  const demoPhone = process.env.NEXT_PUBLIC_DEMO_PHONE || "(555) 123-4567";

  const handleCallDemo = () => {
    window.location.href = `tel:${demoPhone}`;
  };

  const handleSeeDemo = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "#demo";
    if (calendlyUrl.startsWith("http")) {
      window.open(calendlyUrl, "_blank");
    } else {
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    {
      icon: TrendingUp,
      value: "23%",
      label: "Average increase in booked estimates",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Coverage even after hours",
    },
    {
      icon: DollarSign,
      value: "$18,000",
      label: "Avg. monthly revenue captured",
    },
    {
      icon: Zap,
      value: "< 3 days",
      label: "Setup time",
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Never Miss Another{" "}
              <span className="text-primary-600">Landscaping Lead</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              AI Receptionist that answers calls 24/7, books estimates, and
              sounds completely human. Starting at{" "}
              <span className="font-semibold text-slate-900">$297/month</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                variant="accent"
                onClick={handleSeeDemo}
                className="gap-2"
              >
                <PlayCircle className="h-5 w-5" />
                See Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleCallDemo}
                className="gap-2"
              >
                <Phone className="h-5 w-5" />
                Call the AI Now: {demoPhone}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Setup in 48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>No long-term contract</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image/Mockup */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                AI-Powered
              </div>

              {/* Phone mockup */}
              <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Incoming Call</div>
                    <div className="text-sm text-slate-600">New Customer</div>
                  </div>
                </div>

                {/* Chat interface */}
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-500 mb-1">Customer</div>
                    <div className="text-sm text-slate-900">
                      Hi, I need a quote for landscaping my backyard.
                    </div>
                  </div>
                  <div className="bg-primary-100 rounded-lg p-3 ml-6">
                    <div className="text-xs text-primary-700 mb-1">AI Assistant</div>
                    <div className="text-sm text-slate-900">
                      I'd be happy to help! Can you tell me the approximate size
                      of your backyard and what type of work you're looking for?
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-slate-500 mb-1">Customer</div>
                    <div className="text-sm text-slate-900">
                      About 2,000 sq ft. Need new sod and some plants.
                    </div>
                  </div>
                  <div className="bg-primary-100 rounded-lg p-3 ml-6">
                    <div className="text-xs text-primary-700 mb-1">AI Assistant</div>
                    <div className="text-sm text-slate-900">
                      Perfect! I can schedule a free estimate. What day works best
                      for you this week?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-accent-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
              100% Human-Sounding
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
