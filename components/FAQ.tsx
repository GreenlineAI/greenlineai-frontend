"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What industries do you have lead data for?",
      answer:
        "We specialize in home services: landscaping, lawn care, HVAC, plumbing, roofing, electrical, cleaning, pest control, and more. Our database includes 2M+ verified businesses across the US, updated weekly.",
    },
    {
      question: "How fresh is the lead data?",
      answer:
        "Every contact is verified within 7 days of delivery. We run phone verification, email validation, and cross-reference against multiple data sources. Stale data is automatically removed. Average contact rate is 85%+.",
    },
    {
      question: "Can I target by specific criteria?",
      answer:
        "Yes. Filter by geography (state, city, zip, radius), industry type, Google rating (great for targeting businesses needing help), business size, years in operation, and more. We'll help you build the perfect list for your offer.",
    },
    {
      question: "How does the AI outreach work?",
      answer:
        "Our AI makes human-sounding phone calls to your prospects. It introduces your service, handles objections, answers questions, and books qualified meetings directly on your calendar. You only talk to interested prospects.",
    },
    {
      question: "Is this TCPA compliant?",
      answer:
        "Yes. All outreach is fully TCPA and GDPR compliant. We handle consent tracking, automatic opt-outs, and maintain do-not-call lists. Our legal team reviews all campaigns before launch.",
    },
    {
      question: "What's included in the white-label option?",
      answer:
        "Full custom branding: your domain, logo, colors, and company name throughout. Client management dashboard, separate sub-accounts, and the ability to resell at your own pricing. Your clients never see our brand.",
    },
    {
      question: "How do I integrate with my CRM?",
      answer:
        "Native integrations with HubSpot, Salesforce, GoHighLevel, Pipedrive, and more. Or use our REST API to build custom workflows. All leads and call transcripts sync automatically.",
    },
    {
      question: "What's your refund policy?",
      answer:
        "30-day money-back guarantee on all plans. If the leads don't convert or the outreach doesn't perform, we'll refund your investment. We're confident in our data quality and AI performance.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything agencies need to know about our lead generation platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-slate-500 flex-shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Ready to see it in action?
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            Book a strategy call and get a free sample of leads for your target market
          </p>
          <button
            onClick={() => {
              const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
              window.open(calendlyUrl, "_blank");
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors shadow-sm hover:shadow-md"
          >
            Book Strategy Call
          </button>
        </div>
      </div>
    </section>
  );
}
