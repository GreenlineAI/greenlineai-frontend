"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the AI answer my calls?",
      answer:
        "Simply forward your business line to your GreenLine AI number. When customers call, our AI answers instantly, greets them professionally, asks about their needs, and either books an appointment or takes a message. You get notified immediately.",
    },
    {
      question: "Will customers know they're talking to AI?",
      answer:
        "Our AI uses natural, human-like conversation that most callers can't distinguish from a real person. It understands context, handles interruptions, and responds naturally. Many customers assume they're speaking with your receptionist.",
    },
    {
      question: "Can the AI book appointments on my calendar?",
      answer:
        "Yes! Connect your Google Calendar or other scheduling tool, and the AI will check your availability in real-time. It books appointments directly on your calendar and sends confirmation texts to customers.",
    },
    {
      question: "What if the customer has a question the AI can't answer?",
      answer:
        "The AI will take a detailed message and promise a callback. You get an instant notification with the caller's info and their question. For urgent matters, we can set up live call transfers to your cell phone.",
    },
    {
      question: "How long does setup take?",
      answer:
        "Most businesses are up and running in 15-20 minutes. Tell us about your services, set your availability, and customize your greeting. We handle the rest. No technical skills or special equipment needed.",
    },
    {
      question: "What if I want to change my AI's script or voice?",
      answer:
        "You have full control through your dashboard. Update your services, pricing, hours, or script anytime. Changes take effect immediately. You can also choose from multiple AI voice options.",
    },
    {
      question: "Does it work with my existing phone number?",
      answer:
        "Yes! Keep your existing business number. Just set up call forwarding to your GreenLine AI number. We can also provide a new local number if you prefer. Works with any phone system.",
    },
    {
      question: "What's your refund policy?",
      answer:
        "14-day free trial with no credit card required. After that, cancel anytime with no long-term contracts. If you're not booking more jobs within 30 days, we'll refund your first month.",
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
            Everything you need to know about AI phone answering
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
            Ready to hear it in action?
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            Try our live AI demo and hear how natural the conversation sounds
          </p>
          <button
            onClick={() => {
              document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors shadow-sm hover:shadow-md"
          >
            Try Live Demo
          </button>
        </div>
      </div>
    </section>
  );
}
