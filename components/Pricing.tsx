"use client";

import { Check, Star, Phone, Zap, Building, Headphones, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      subtitle: "For small teams",
      price: "$297",
      priceUnit: "/month",
      icon: Phone,
      popular: false,
      description: "Perfect for businesses testing AI voice outreach",
      features: [
        "500 AI call minutes/month",
        "1 AI voice agent",
        "Basic call scripts",
        "Call recording & transcripts",
        "Email notifications",
        "Standard support",
      ],
      cta: "Start Free Trial",
      note: "14-day free trial, no credit card required",
    },
    {
      name: "Professional",
      subtitle: "Most popular",
      price: "$697",
      priceUnit: "/month",
      icon: Headphones,
      popular: true,
      description: "Full-featured AI calling for growing businesses",
      features: [
        "2,000 AI call minutes/month",
        "3 AI voice agents",
        "Custom voice & scripts",
        "Smart call scheduling",
        "Meeting booking integration",
        "CRM integration (HubSpot, Salesforce)",
        "Real-time analytics dashboard",
        "Priority support",
      ],
      cta: "Book Strategy Call",
      note: "Most chosen by landscaping businesses",
    },
    {
      name: "Enterprise",
      subtitle: "Unlimited scale",
      price: "$1,497",
      priceUnit: "/month",
      icon: Building,
      popular: false,
      description: "White-label AI calling platform for agencies",
      features: [
        "Unlimited AI call minutes",
        "Unlimited AI voice agents",
        "White-label branding",
        "Multi-location support",
        "Custom integrations & API",
        "Dedicated account manager",
        "Team training & onboarding",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      note: "Custom enterprise pricing available",
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
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered Voice Calling
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Scale Your Outreach with AI Voice Agents
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI makes hundreds of personalized calls daily, books meetings, and
            follows up automatically. Start with a free trial.
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

        {/* Key Benefits */}
        <div className="grid sm:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">24/7 Calling</div>
            <div className="text-sm text-slate-600">Never miss a lead</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Natural Voice</div>
            <div className="text-sm text-slate-600">Human-like conversations</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Smart Follow-up</div>
            <div className="text-sm text-slate-600">Automated persistence</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Live Transfer</div>
            <div className="text-sm text-slate-600">Hot leads to your team</div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>TCPA compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>No setup fees</span>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Book 5+ Meetings Per Week on Autopilot
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              Our AI agents make 200+ calls daily. With a 15% contact rate and
              intelligent objection handling, you'll fill your calendar fast.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  200+
                </div>
                <div className="text-sm text-slate-600">Calls per day per agent</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  15-25%
                </div>
                <div className="text-sm text-slate-600">
                  Average connection rate
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  5-10x
                </div>
                <div className="text-sm text-slate-600">
                  Typical ROI in 90 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
