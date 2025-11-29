"use client";

import { Calendar, Play, CheckCircle, Clock, Headphones } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Demo() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";

  const handleBookDemo = () => {
    window.open(calendlyUrl, "_blank");
  };

  const demoFeatures = [
    "See the AI handle real landscaping calls",
    "Customize responses for your business",
    "Ask any questions about setup",
    "Get a personalized ROI estimate",
    "No obligation, completely free",
  ];

  const whatYoullSee = [
    {
      title: "Live Call Demonstration",
      description: "Watch the AI answer calls, book appointments, and handle customer questions in real-time.",
    },
    {
      title: "Customization Options",
      description: "See how we tailor the AI's voice, knowledge, and responses to match your business.",
    },
    {
      title: "Integration Walkthrough",
      description: "Learn how it connects with your calendar, CRM, and existing phone system.",
    },
  ];

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Book a free 15-minute demo and experience the AI receptionist
            firsthand. We'll show you exactly how it works for landscaping businesses.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Book Demo CTA */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 md:p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-500 rounded-full mb-6">
                  <Headphones className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  Book Your Free Demo
                </h3>

                <p className="text-lg text-slate-300 mb-8">
                  In just 15 minutes, you'll see exactly how our AI can transform
                  your landscaping business's phone experience.
                </p>

                {/* Features list */}
                <div className="text-left mb-8 space-y-3">
                  {demoFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent-400 flex-shrink-0" />
                      <span className="text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  variant="accent"
                  onClick={handleBookDemo}
                  className="w-full gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule Free Demo
                </Button>

                <p className="text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  Takes only 15 minutes
                </p>
              </div>
            </Card>
          </div>

          {/* Right: What you'll see */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Play className="h-6 w-6 text-accent-500" />
              What You'll Experience
            </h3>

            <div className="space-y-4">
              {whatYoullSee.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-accent-500/20 border border-accent-500/30 rounded-xl">
              <p className="text-accent-200 text-sm font-semibold mb-2">
                COMING SOON
              </p>
              <p className="text-white">
                Try our AI directly in your browser! We're building a web demo
                so you can talk to the AI without scheduling a call.
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
