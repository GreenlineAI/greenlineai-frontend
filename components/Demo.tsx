"use client";

import { Calendar, MessageCircle } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import VapiDemo from "./VapiDemo";

export default function Demo() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";

  const handleBookDemo = () => {
    window.open(calendlyUrl, "_blank");
  };

  const suggestedQuestions = [
    "How much do you charge for lawn maintenance?",
    "Can I get an estimate for landscaping?",
    "Do you offer spring cleanup services?",
    "What's your availability next week?",
    "Do you handle commercial properties?",
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try It Right Now
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Talk to our AI receptionist live. No signup required - just click and start talking.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Live AI Demo */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 md:p-12">
              <VapiDemo />
            </Card>
          </div>

          {/* Right: Suggested questions */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-accent-500" />
              Try Asking These Questions
            </h3>

            <div className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-white font-medium pt-0.5">{question}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-accent-500/20 border border-accent-500/30 rounded-xl">
              <p className="text-accent-200 text-sm font-semibold mb-2">
                PRO TIP
              </p>
              <p className="text-white">
                Try to stump it! Ask complex questions, speak naturally, or throw
                in some curveballs. See how it handles real conversations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section - Book a call */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">
              Want to See It Customized for Your Business?
            </h3>
            <p className="text-slate-300 mb-6">
              Book a free 15-minute call and we'll show you how it works with your
              specific services, pricing, and availability.
            </p>
            <Button
              size="lg"
              variant="accent"
              onClick={handleBookDemo}
              className="gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book Free Demo Call
            </Button>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">78%</div>
            <div className="text-slate-300">
              Of callers can't tell it's AI
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">{'<'}2s</div>
            <div className="text-slate-300">
              Average response time
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">99.9%</div>
            <div className="text-slate-300">
              Uptime guarantee
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
