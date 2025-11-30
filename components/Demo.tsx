"use client";

import { Calendar, MessageCircle, Headphones, ArrowRight } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import VapiDemo from "./VapiDemo";

export default function Demo() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";

  const handleBookDemo = () => {
    window.open(calendlyUrl, "_blank");
  };

  const suggestedQuestions = [
    "Hi, I'm interested in marketing services for my landscaping company",
    "What kind of leads do you have for home services?",
    "How does your AI outreach work?",
    "Can you tell me about pricing for your services?",
    "What makes your leads better than other providers?",
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Headphones className="h-4 w-4" />
            Live AI Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience Our AI Sales Agent
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            This is the same AI your prospects will talk to. Try it yourself -
            no signup required, just click and start talking.
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
              Sample Conversation Starters
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
                THIS IS WHAT YOUR PROSPECTS HEAR
              </p>
              <p className="text-white">
                Our AI handles objections, answers questions, and books meetings
                automatically. Your team only talks to qualified, interested leads.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section - Sales Funnel CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-600/20 to-accent-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Scale Your Client Acquisition?
                </h3>
                <p className="text-slate-300 mb-6">
                  Book a 20-minute strategy call. We'll show you exactly how many
                  leads are available in your target market and build a custom
                  outreach plan for your agency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="accent"
                    onClick={handleBookDemo}
                    className="gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Strategy Call
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                    className="gap-2 border-white/30 text-white hover:bg-white/10"
                  >
                    View Pricing
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">15 min</div>
                  <div className="text-sm text-slate-300">Quick call</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">Free</div>
                  <div className="text-sm text-slate-300">Lead sample</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">Custom</div>
                  <div className="text-sm text-slate-300">Market analysis</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-1">No</div>
                  <div className="text-sm text-slate-300">Obligation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">85%</div>
            <div className="text-slate-300">
              Contact rate on our leads
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">{'<'}2s</div>
            <div className="text-slate-300">
              AI response time
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-400 mb-2">3x</div>
            <div className="text-slate-300">
              Higher conversion vs cold lists
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
