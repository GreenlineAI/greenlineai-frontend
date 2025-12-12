"use client";

import { useState } from "react";
import { Check, Star, Phone, Zap, Building, Headphones, MessageSquare, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STRIPE_PRICES } from "@/lib/stripe/config";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      key: "starter",
      subtitle: "Solo operators",
      monthlyPrice: 149,
      annualPrice: 124, // ~17% discount (2 months free)
      priceIdMonthly: STRIPE_PRICES.starter.monthly,
      priceIdAnnual: STRIPE_PRICES.starter.annual,
      icon: Phone,
      popular: false,
      description: "Perfect for one-person operations",
      features: [
        "200 call minutes/month",
        "1 phone number",
        "Basic AI script",
        "Call recording & transcripts",
        "Email notifications",
        "Standard support",
      ],
      cta: "Start Free Trial",
      note: "14-day free trial, no credit card required",
    },
    {
      name: "Professional",
      key: "professional",
      subtitle: "Most popular",
      monthlyPrice: 297,
      annualPrice: 247, // ~17% discount (2 months free)
      priceIdMonthly: STRIPE_PRICES.professional.monthly,
      priceIdAnnual: STRIPE_PRICES.professional.annual,
      icon: Headphones,
      popular: true,
      description: "For growing home services businesses",
      features: [
        "500 call minutes/month",
        "2 phone numbers",
        "Custom AI voice & script",
        "Appointment booking",
        "Google Calendar sync",
        "SMS & email notifications",
        "Call analytics dashboard",
        "Priority support",
      ],
      cta: "Start Free Trial",
      note: "Most chosen by landscaping businesses",
    },
    {
      name: "Business",
      key: "business",
      subtitle: "High volume",
      monthlyPrice: 497,
      annualPrice: 414, // ~17% discount (2 months free)
      priceIdMonthly: STRIPE_PRICES.business.monthly,
      priceIdAnnual: STRIPE_PRICES.business.annual,
      icon: Building,
      popular: false,
      description: "For established businesses with high call volume",
      features: [
        "Unlimited call minutes",
        "5 phone numbers",
        "Multiple AI personas",
        "Multi-location support",
        "CRM integrations",
        "Priority call routing",
        "Dedicated account manager",
        "99.9% uptime SLA",
      ],
      cta: "Contact Sales",
      note: "Best for businesses with 100+ calls/month",
    },
  ];

  const handleCheckout = async (plan: typeof plans[0]) => {
    // For Business plan, redirect to Calendly for sales call
    if (plan.key === "business") {
      const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://cal.com/greenlineai/30min";
      window.open(calendlyUrl, "_blank");
      return;
    }

    setLoadingPlan(plan.key);

    try {
      const priceId = isAnnual ? plan.priceIdAnnual : plan.priceIdMonthly;

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        // If unauthorized, redirect to signup
        if (response.status === 401) {
          window.location.href = `/signup?plan=${plan.key}&billing=${isAnnual ? 'annual' : 'monthly'}`;
        } else {
          console.error("Checkout error:", error);
          alert(error.error || "Failed to start checkout. Please try again.");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Less Than the Cost of Missed Jobs
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            One missed call could cost you $500+. Our AI answers every call
            for a fraction of what you'd pay a receptionist.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-primary-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                2 months free
              </span>
            )}
          </div>
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
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="line-through">${plan.monthlyPrice}/mo</span>
                      <span className="text-green-600 ml-2">Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/yr</span>
                    </div>
                  )}
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
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.key}
                >
                  {loadingPlan === plan.key && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
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
            <div className="font-semibold text-slate-900">24/7 Answering</div>
            <div className="text-sm text-slate-600">Never miss a call</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Natural Voice</div>
            <div className="text-sm text-slate-600">Sounds like a real person</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Books Jobs</div>
            <div className="text-sm text-slate-600">Straight to your calendar</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <div className="font-semibold text-slate-900">Easy Setup</div>
            <div className="text-sm text-slate-600">Ready in 15 minutes</div>
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
              The Math is Simple
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              If your average job is worth $300, you only need to book 1 extra job
              per month to pay for the entire service.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-red-500 mb-1">
                  $500+
                </div>
                <div className="text-sm text-slate-600">Average cost of a missed call</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  85%
                </div>
                <div className="text-sm text-slate-600">
                  Of callers won't leave voicemail
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  3-5x
                </div>
                <div className="text-sm text-slate-600">
                  More jobs booked vs voicemail
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
