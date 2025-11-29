"use client";

import { Check, Star } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Pricing() {
  const plans = [
    {
      name: "Standard",
      price: "$297",
      popular: false,
      features: [
        "24/7 AI call answering",
        "Appointment booking to your calendar",
        "Basic service questions",
        "Text message confirmations",
        "Weekly call reports",
        "Email support",
      ],
    },
    {
      name: "Premium",
      price: "$397",
      popular: true,
      features: [
        "Everything in Standard",
        "Photo request automation",
        "CRM integration",
        "Custom call routing",
        "Priority support",
        "Bilingual (English + Spanish)",
        "Monthly strategy call",
      ],
    },
  ];

  const handleGetStarted = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
    if (calendlyUrl.startsWith("http")) {
      window.open(calendlyUrl, "_blank");
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            No hidden fees. No setup costs. Cancel anytime. Choose the plan
            that's right for your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <Card
              key={index}
              hover
              className={`p-8 relative ${
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

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-600">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "accent" : "primary"}
                className="w-full"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>

        {/* Guarantees */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary-600" />
              <span>No setup fees</span>
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

          <p className="text-slate-600 max-w-2xl mx-auto">
            Both plans include free customization and unlimited support. We'll
            work with you to make sure the AI is perfect for your business.
          </p>
        </div>

        {/* ROI Calculator hint */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Pays for itself with just 1-2 extra jobs per month
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              The average landscaping company captures an additional $18,000 in
              monthly revenue by never missing a call. That's a 60x ROI.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  $297
                </div>
                <div className="text-sm text-slate-600">Monthly investment</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  2 jobs
                </div>
                <div className="text-sm text-slate-600">
                  To break even (avg $150/job)
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-accent-600 mb-1">
                  $18k
                </div>
                <div className="text-sm text-slate-600">
                  Average monthly revenue increase
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
