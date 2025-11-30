import {
  Database,
  Target,
  Phone,
  Mail,
  BarChart3,
  Shield,
  Zap,
  Users,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: Database,
      title: "Verified Lead Data",
      description:
        "Every contact verified within 7 days. Business name, phone, email, address, and Google rating included with every lead.",
    },
    {
      icon: Target,
      title: "Industry Targeting",
      description:
        "Landscaping, HVAC, plumbing, roofing, cleaning, and more. Filter by service type, rating, location, and business size.",
    },
    {
      icon: Phone,
      title: "AI Voice Outreach",
      description:
        "Human-sounding AI calls your prospects, qualifies them, and books meetings directly on your calendar.",
    },
    {
      icon: Mail,
      title: "Multi-Channel Campaigns",
      description:
        "Combine phone, email, and SMS in automated sequences. AI personalizes each touchpoint based on prospect data.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Track contact rates, response rates, and conversions. See exactly which campaigns and messages perform best.",
    },
    {
      icon: Shield,
      title: "TCPA & GDPR Compliant",
      description:
        "Built-in compliance tools, automatic opt-out handling, and consent tracking. Never worry about regulations.",
    },
    {
      icon: Zap,
      title: "CRM Integration",
      description:
        "Native integrations with HubSpot, Salesforce, GoHighLevel, and more. Or use our API for custom workflows.",
    },
    {
      icon: Users,
      title: "White-Label Ready",
      description:
        "Resell to your clients with your branding. Custom domains, logos, and colors. Your clients never see our name.",
    },
    {
      icon: Building,
      title: "Agency Dashboard",
      description:
        "Manage multiple clients from one account. Separate reporting, dedicated sub-accounts, and team permissions.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Scale Lead Gen
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From raw lead data to closed deals. Built for marketing agencies
            and SaaS companies who sell to home services businesses.
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
            Start with leads, scale to full-service outreach
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Buy lead lists a la carte, upgrade to done-for-you outreach, or
            white-label the entire platform. Grow at your own pace.
          </p>
        </div>
      </div>
    </section>
  );
}
