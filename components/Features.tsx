import {
  Phone,
  Calendar,
  MessageSquare,
  Clock,
  BarChart3,
  Shield,
  Zap,
  Bell,
  Mic,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Phone,
      title: "24/7 Call Answering",
      description:
        "AI answers every call instantly, day or night. Weekends, holidays, while you're on a job - never miss a customer again.",
    },
    {
      icon: Calendar,
      title: "Instant Appointment Booking",
      description:
        "AI checks your availability and books jobs directly on your calendar. Customers get confirmed appointments in real-time.",
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description:
        "Human-like AI that understands context, answers questions about your services, and handles objections naturally.",
    },
    {
      icon: Mic,
      title: "Custom Voice & Script",
      description:
        "Train the AI on your services, pricing, and service area. It sounds like your business, not a generic robot.",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description:
        "Get text and email alerts for every call. See caller info, what they need, and whether a job was booked.",
    },
    {
      icon: Clock,
      title: "Call Recording & Transcripts",
      description:
        "Review every conversation. Full recordings and written transcripts so you never miss important details.",
    },
    {
      icon: BarChart3,
      title: "Call Analytics Dashboard",
      description:
        "Track call volume, booking rates, and peak hours. See what services customers ask about most.",
    },
    {
      icon: Zap,
      title: "Easy Setup",
      description:
        "Forward your existing business number or get a new one. No hardware, no apps to install - works with any phone.",
    },
    {
      icon: Shield,
      title: "Professional & Reliable",
      description:
        "99.9% uptime guarantee. Your AI receptionist never calls in sick, takes breaks, or has a bad day.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Capture More Jobs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A complete AI phone system built for landscapers, contractors,
            and home services businesses who can't afford to miss calls.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="bg-primary-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Your AI receptionist, ready in 15 minutes
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No technical skills needed. Just tell us about your business and
            start forwarding calls. It's that simple.
          </p>
        </div>
      </div>
    </section>
  );
}
