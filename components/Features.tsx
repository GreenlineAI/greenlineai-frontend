import {
  Clock,
  Calendar,
  HelpCircle,
  Languages,
  Image,
  Database,
  AlertCircle,
  MessageSquare,
  Mic,
} from "lucide-react";
import Card from "./ui/Card";

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Never miss a call again, even at 2am. Your AI receptionist works around the clock to capture every lead.",
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description:
        "Syncs directly to Google Calendar. Automatically schedules estimates and sends confirmations to customers.",
    },
    {
      icon: HelpCircle,
      title: "Service Questions",
      description:
        "Answers FAQs about lawn care, landscaping, pricing, and services. Trained on your specific offerings.",
    },
    {
      icon: Languages,
      title: "Bilingual Support",
      description:
        "Seamlessly handles conversations in English and Spanish, expanding your customer base effortlessly.",
    },
    {
      icon: Image,
      title: "Photo Requests",
      description:
        "Asks customers to text photos of their property for more accurate estimates before the visit.",
    },
    {
      icon: Database,
      title: "CRM Integration",
      description:
        "Automatically logs all calls and customer information to your existing CRM system.",
    },
    {
      icon: AlertCircle,
      title: "Emergency Triage",
      description:
        "Identifies urgent situations like flooding or broken irrigation and routes them appropriately.",
    },
    {
      icon: MessageSquare,
      title: "Text Confirmations",
      description:
        "Sends automated appointment reminders and confirmations via SMS to reduce no-shows.",
    },
    {
      icon: Mic,
      title: "Real Human Voice",
      description:
        "Natural, conversational AI that sounds completely human. Customers won't know it's AI.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything Your Landscaping Business Needs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Powerful features designed specifically for landscaping and lawn
            care companies. No technical expertise required.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover className="p-6">
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
            All features included in every plan
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No hidden fees, no feature gates, no surprises. Get everything you
            need to capture more leads and grow your business.
          </p>
        </div>
      </div>
    </section>
  );
}
