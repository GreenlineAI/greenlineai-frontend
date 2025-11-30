"use client";

import { Check, Star, Database, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Pricing() {
  const plans = [
    {
      name: "Lead Lists",
      subtitle: "Pay per lead",
      price: "$0.50",
      priceUnit: "/lead",
      icon: Database,
      popular: false,
      description: "Verified home services business contacts delivered to your inbox",
      features: [
        "Verified phone & email contacts",
        "Business name, address, rating",
        "Industry classification",
        "Geographic targeting",
        "CSV export or CRM sync",
        "Fresh data (updated weekly)",
      ],
      cta: "Get Sample Leads",
      note: "Bulk pricing: $200-500 for 100+ leads",
    },
    {
      name: "Outreach Service",
      subtitle: "Done for you",
      price: "$750",
      priceUnit: "/month",
      icon: Phone,
      popular: true,
      description: "We call and email your prospects with AI-powered personalization",
      features: [
        "500 leads contacted/month",
        "AI voice + email outreach",
        "Multi-touch campaigns",
        "Appointment booking",
        "White-labeled reports",
        "Dedicated account manager",
        "CRM integration included",
      ],
      cta: "Book Strategy Call",
      note: "Custom volumes available",
    },
    {
      name: "White-Label",
      subtitle: "Your own platform",
      price: "$1,500",
      priceUnit: "/month",
      icon: Building,
      popular: false,
      description: "Fully branded AI sales platform for your agency or clients",
      features: [
        "Custom domain & branding",
        "Your own Vapi AI assistant",
        "Client management dashboard",
        "Lead import & management",
        "Campaign analytics",
        "API access",
        "Multi-user support",
        "Dedicated onboarding",
      ],
      cta: "Schedule Demo",
      note: "$2,500 one-time setup fee",
    },
  ];

  const handleGetStarted = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
    window.open(calendlyUrl, "_blank");
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose How You Want to Grow
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start with lead lists, scale to done-for-you outreach, or white-label
            the entire platform. Flexible options for any agency size.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className={`p-8 relative hover:shadow-md transition-shadow ${
                  plan.popular ? "ring-2 ring-primary-600 shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Star className="h-4 w-4 fill-white" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500">{plan.subtitle}</p>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-600">{plan.priceUnit}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="h-3.5 w-3.5 text-primary-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.note && (
                  <p className="text-xs text-slate-500 text-center mb-4 italic">
                    {plan.note}
                  </p>
                )}

                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  {plan.cta}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Guarantees */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>TCPA & GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Close Just 2 Deals to Cover Your Investment
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              Our clients average $5,000+ revenue per closed deal. With 85% contact
              rates and AI-powered follow-up, your ROI compounds fast.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  $750
                </div>
                <div className="text-sm text-slate-600">Monthly investment</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  15-25%
                </div>
                <div className="text-sm text-slate-600">
                  Response rate on outreach
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  10x+
                </div>
                <div className="text-sm text-slate-600">
                  Average client ROI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
