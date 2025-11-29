"use client";

import { Phone, Play } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Demo() {
  const demoPhone = process.env.NEXT_PUBLIC_DEMO_PHONE || "(408) 365-4503";

  const handleCallDemo = () => {
    window.location.href = `tel:${demoPhone}`;
  };

  const suggestedQuestions = [
    "How much do you charge for lawn maintenance?",
    "Can I get an estimate for landscaping my backyard?",
    "Do you offer spring cleanup services?",
    "What's your availability for next week?",
    "Do you handle commercial properties?",
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Hear It In Action
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Don't take our word for it. Call the AI right now and ask it
            landscaping questions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Call to action */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 md:p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-500 rounded-full mb-6">
                  <Phone className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  Try It Right Now
                </h3>

                <p className="text-lg text-slate-300 mb-8">
                  Call our demo line and experience the AI receptionist
                  firsthand. It's available 24/7.
                </p>

                {/* Phone Number - Large and prominent */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-6 shadow-2xl">
                  <div className="text-sm font-semibold text-primary-100 mb-2">
                    DEMO LINE
                  </div>
                  <a
                    href={`tel:${demoPhone}`}
                    className="text-4xl md:text-5xl font-bold text-white hover:text-accent-300 transition-colors"
                  >
                    {demoPhone}
                  </a>
                </div>

                <Button
                  size="lg"
                  variant="accent"
                  onClick={handleCallDemo}
                  className="w-full gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </Button>
              </div>
            </Card>
          </div>

          {/* Right: Suggested questions */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Play className="h-6 w-6 text-accent-500" />
              Try Asking These Questions
            </h3>

            <div className="space-y-4">
              {suggestedQuestions.map((question, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20 p-4 hover:bg-white/20 transition-all cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-white font-medium pt-1">{question}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-accent-500/20 border border-accent-500/30 rounded-xl">
              <p className="text-accent-200 text-sm font-semibold mb-2">
                💡 PRO TIP
              </p>
              <p className="text-white">
                Try to stump it! Ask complex questions, speak naturally, or even
                throw in some curveballs. You'll see how it handles real-world
                conversations.
              </p>
            </div>
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
