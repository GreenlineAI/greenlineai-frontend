"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Does it really sound human?",
      answer:
        "Yes. 78% of callers can't tell it's AI. The voice is natural, responds in real-time, and handles conversations just like a receptionist would. Try calling our demo line to hear it yourself!",
    },
    {
      question: "What if customers don't like talking to AI?",
      answer:
        "In our experience with 200+ landscaping companies, less than 5% of callers even ask. Those who do usually say 'that's cool' and continue. We've never had a customer hang up because of it. The AI is designed to be helpful and natural, focusing on solving their needs.",
    },
    {
      question: "How does it know my pricing and services?",
      answer:
        "During setup, we customize the AI with your exact services, pricing ranges, service area, and availability. It only shares information you provide. You have complete control over what the AI knows and can say.",
    },
    {
      question: "Can it handle emergency calls?",
      answer:
        "Yes. The AI can identify urgent situations (flooding, broken irrigation, etc.) and either text you immediately or transfer the call to your emergency line. You define what counts as an emergency and how to handle it.",
    },
    {
      question: "What happens if it doesn't know the answer?",
      answer:
        "It will politely tell the caller 'That's a great question. Let me have [Owner Name] call you back within 2 hours to discuss that specifically' and captures their contact info. The AI is trained to be honest about its limitations.",
    },
    {
      question: "Can I use my existing phone number?",
      answer:
        "Yes. We can either forward calls to the AI, or the AI can answer on a new number while you keep your existing one for direct calls. Most clients prefer call forwarding so they can use their existing business number.",
    },
    {
      question: "How long does setup take?",
      answer:
        "Most landscaping companies are live within 2-3 business days. You fill out a 10-minute intake form, we build your AI, you test it, and go live. We handle all the technical setup for you.",
    },
    {
      question: "What if I'm not satisfied?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not happy for any reason in the first month, we'll refund you 100%. No questions asked. We're confident you'll love it, but we want you to feel comfortable trying it risk-free.",
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
            Everything you need to know about our AI receptionist
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
            Still have questions?
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            Book a free demo call and we'll answer all your questions personally
          </p>
          <button
            onClick={() => {
              const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "#contact";
              if (calendlyUrl.startsWith("http")) {
                window.open(calendlyUrl, "_blank");
              } else {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors shadow-sm hover:shadow-md"
          >
            Book Free Demo Call
          </button>
        </div>
      </div>
    </section>
  );
}
