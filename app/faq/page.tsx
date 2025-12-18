"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "What is GreenLine AI?",
    answer:
      "GreenLine AI provides AI-powered voice agents specifically designed for landscaping businesses. Our AI answers your business calls 24/7, captures leads, schedules appointments, and integrates with your existing tools - so you never miss another opportunity.",
  },
  {
    category: "Getting Started",
    question: "How does the AI voice agent work?",
    answer:
      "When a customer calls your business number, our AI agent answers with a natural, human-like voice. It can answer questions about your services, capture caller information, schedule appointments on your calendar, and send you instant notifications about new leads.",
  },
  {
    category: "Getting Started",
    question: "How long does setup take?",
    answer:
      "Most businesses are up and running within 24-48 hours. We handle the technical setup, customize the AI to your specific services and pricing, and integrate with your existing phone system and calendar.",
  },
  {
    category: "Features",
    question: "Can the AI schedule appointments on my calendar?",
    answer:
      "Yes! GreenLine AI integrates with popular calendar systems like Google Calendar and Cal.com. The AI can check your availability in real-time and book appointments directly, sending confirmation to both you and your customer.",
  },
  {
    category: "Features",
    question: "What information does the AI collect from callers?",
    answer:
      "The AI collects essential lead information including name, phone number, service address, type of service needed, preferred timing, and any special requests. All information is automatically added to your CRM dashboard.",
  },
  {
    category: "Features",
    question: "Can I customize what the AI says?",
    answer:
      "Absolutely. We customize the AI's voice, greeting, and responses to match your brand. You can specify your services, pricing, service areas, and any frequently asked questions specific to your business.",
  },
  {
    category: "Features",
    question: "Does the AI work after business hours?",
    answer:
      "Yes! One of the biggest benefits is 24/7 availability. The AI answers calls nights, weekends, and holidays - capturing leads that would otherwise go to voicemail or competitors.",
  },
  {
    category: "Pricing & Plans",
    question: "How much does GreenLine AI cost?",
    answer:
      "We offer flexible plans starting at $149/month for the Starter plan (100 minutes), $349/month for Growth (300 minutes), and custom Enterprise plans for high-volume businesses. All plans include setup, customization, and ongoing support.",
  },
  {
    category: "Pricing & Plans",
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 14-day free trial so you can experience the AI in action with your real business calls. No credit card required to start.",
  },
  {
    category: "Pricing & Plans",
    question: "What happens if I exceed my monthly minutes?",
    answer:
      "If you exceed your plan's minutes, additional minutes are billed at a per-minute rate. We'll notify you when you're approaching your limit so there are no surprises. You can also upgrade your plan at any time.",
  },
  {
    category: "Technical",
    question: "Do I need to change my phone number?",
    answer:
      "No. We work with your existing phone number through call forwarding. Your customers call the same number they always have - the calls are simply answered by our AI when you're unavailable or during specified hours.",
  },
  {
    category: "Technical",
    question: "What if the AI can't handle a specific question?",
    answer:
      "The AI is designed to handle common landscaping inquiries. For complex or unusual requests, it captures the caller's information and notes, then notifies you immediately so you can follow up personally.",
  },
  {
    category: "Technical",
    question: "Is my customer data secure?",
    answer:
      "Yes. We use enterprise-grade encryption and security practices. All data is stored securely and we never share your customer information with third parties. We're compliant with industry security standards.",
  },
  {
    category: "Support",
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support with responses within 24 hours. Growth and Enterprise plans include priority phone support and a dedicated account manager to help optimize your AI agent.",
  },
  {
    category: "Support",
    question: "Can I make changes to my AI agent after setup?",
    answer:
      "Yes! You can request updates to your AI's responses, services, pricing, or any other details at any time. We typically implement changes within 24-48 hours.",
  },
];

const categories = [...new Set(faqs.map((faq) => faq.category))];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <HelpCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Frequently Asked <span className="text-primary-600">Questions</span>
              </h1>
              <p className="text-xl text-slate-600">
                Everything you need to know about GreenLine AI and how it can
                help your landscaping business grow.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === globalIndex;

                return (
                  <div
                    key={globalIndex}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : globalIndex)
                      }
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-900 pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-500 flex-shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-16 text-center bg-slate-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-slate-600 mb-6">
                Can't find the answer you're looking for? Our team is here to
                help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
