import { Settings, Phone, Rocket } from "lucide-react";
import Card from "./ui/Card";

export default function HowItWorks() {
  const steps = [
    {
      icon: Settings,
      number: "1",
      title: "Setup",
      description: "Tell us about your services, pricing, and availability",
      subtitle: "We customize the AI to sound like your business",
      time: "10 minutes",
      color: "bg-primary-100 text-primary-600",
    },
    {
      icon: Phone,
      number: "2",
      title: "Test",
      description: "Call your AI and test it with real questions",
      subtitle: "Make adjustments until it's perfect",
      time: "2 days",
      color: "bg-accent-100 text-accent-600",
    },
    {
      icon: Rocket,
      number: "3",
      title: "Go Live",
      description: "Forward your calls or use your existing number",
      subtitle: "Start capturing leads immediately",
      time: "Instant",
      color: "bg-primary-100 text-primary-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get Your AI Receptionist in{" "}
            <span className="text-primary-600">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From signup to answering calls in less than a week. No technical
            knowledge required.
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200" />

            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <Card hover className="p-8">
                      {/* Number badge */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {step.number}
                      </div>

                      <div className={`inline-flex p-4 rounded-xl ${step.color} mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {step.title}
                      </h3>

                      <p className="text-slate-700 font-medium mb-2">
                        {step.description}
                      </p>

                      <p className="text-slate-600 mb-4">
                        {step.subtitle}
                      </p>

                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-slate-700">
                          Time: {step.time}
                        </span>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-24 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-accent-200 -mb-6" />
                )}

                <Card className="p-6 relative">
                  {/* Number badge */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg z-10">
                    {step.number}
                  </div>

                  <div className="ml-8">
                    <div className={`inline-flex p-3 rounded-xl ${step.color} mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-slate-700 font-medium mb-2">
                      {step.description}
                    </p>

                    <p className="text-slate-600 text-sm mb-3">
                      {step.subtitle}
                    </p>

                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-slate-700">
                        Time: {step.time}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
            <Rocket className="h-5 w-5" />
            <span>Most clients are live within 2-3 business days</span>
          </div>
        </div>
      </div>
    </section>
  );
}
