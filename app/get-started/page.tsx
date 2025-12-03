"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Building,
  User,
  Mail,
  MapPin,
  Clock,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3 | 4;

const businessTypes = [
  { value: "landscaping", label: "Landscaping" },
  { value: "lawn_care", label: "Lawn Care" },
  { value: "tree_service", label: "Tree Service" },
  { value: "hardscaping", label: "Hardscaping" },
  { value: "irrigation", label: "Irrigation" },
  { value: "snow_removal", label: "Snow Removal" },
  { value: "general_contractor", label: "General Contractor" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "pest_control", label: "Pest Control" },
  { value: "pool_service", label: "Pool Service" },
  { value: "other", label: "Other" },
];

const defaultServices: Record<string, string[]> = {
  landscaping: ["Landscape Design", "Planting", "Mulching", "Garden Maintenance", "Landscape Lighting"],
  lawn_care: ["Lawn Mowing", "Fertilization", "Weed Control", "Aeration", "Overseeding", "Leaf Cleanup"],
  tree_service: ["Tree Trimming", "Tree Removal", "Stump Grinding", "Emergency Tree Service", "Tree Health Assessment"],
  hardscaping: ["Patio Installation", "Retaining Walls", "Walkways", "Outdoor Kitchens", "Fire Pits"],
  irrigation: ["Sprinkler Installation", "Irrigation Repair", "Drip Systems", "Winterization", "Spring Startup"],
  snow_removal: ["Snow Plowing", "Sidewalk Clearing", "Ice Management", "Salt Application", "24/7 Emergency Service"],
  general_contractor: ["Home Renovations", "Room Additions", "Kitchen Remodels", "Bathroom Remodels", "Decks & Patios"],
  hvac: ["AC Installation", "Heating Repair", "Duct Cleaning", "Maintenance Plans", "Emergency Service"],
  plumbing: ["Drain Cleaning", "Water Heater Service", "Pipe Repair", "Fixture Installation", "Emergency Plumbing"],
  electrical: ["Wiring", "Panel Upgrades", "Lighting Installation", "Outlet Repair", "Emergency Electrical"],
  roofing: ["Roof Repair", "Roof Replacement", "Inspections", "Gutter Installation", "Storm Damage"],
  painting: ["Interior Painting", "Exterior Painting", "Cabinet Painting", "Deck Staining", "Commercial Painting"],
  cleaning: ["House Cleaning", "Deep Cleaning", "Move-in/Move-out", "Office Cleaning", "Window Cleaning"],
  pest_control: ["General Pest Control", "Termite Treatment", "Rodent Control", "Mosquito Control", "Wildlife Removal"],
  pool_service: ["Pool Cleaning", "Chemical Balancing", "Equipment Repair", "Pool Opening", "Pool Closing"],
  other: [],
};

export default function GetStartedPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: "",
    businessType: "",
    businessTypeOther: "",
    ownerName: "",
    email: "",
    phone: "",
    website: "",

    // Step 2: Service Area
    city: "",
    state: "",
    zip: "",
    serviceRadius: "25",

    // Step 3: Services
    services: [] as string[],
    customService: "",

    // Step 4: Hours & Preferences
    hoursMonday: "8:00 AM - 5:00 PM",
    hoursTuesday: "8:00 AM - 5:00 PM",
    hoursWednesday: "8:00 AM - 5:00 PM",
    hoursThursday: "8:00 AM - 5:00 PM",
    hoursFriday: "8:00 AM - 5:00 PM",
    hoursSaturday: "9:00 AM - 2:00 PM",
    hoursSunday: "Closed",
    greetingName: "",
    appointmentDuration: "30",
    calendarLink: "",
    pricingInfo: "",
    specialInstructions: "",

    // Phone Number Preference
    phonePreference: "new", // "new", "forward", or "port"
    existingPhoneNumber: "",
    currentProvider: "",
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const addCustomService = () => {
    if (formData.customService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, prev.customService.trim()],
        customService: ""
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const insertData = {
        business_name: formData.businessName,
        business_type: formData.businessType as 'landscaping' | 'lawn_care' | 'tree_service' | 'hardscaping' | 'irrigation' | 'snow_removal' | 'general_contractor' | 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'painting' | 'cleaning' | 'pest_control' | 'pool_service' | 'other',
        business_type_other: formData.businessTypeOther || null,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || null,
        city: formData.city,
        state: formData.state,
        zip: formData.zip || null,
        service_radius_miles: parseInt(formData.serviceRadius),
        services: formData.services,
        hours_monday: formData.hoursMonday,
        hours_tuesday: formData.hoursTuesday,
        hours_wednesday: formData.hoursWednesday,
        hours_thursday: formData.hoursThursday,
        hours_friday: formData.hoursFriday,
        hours_saturday: formData.hoursSaturday,
        hours_sunday: formData.hoursSunday,
        greeting_name: formData.greetingName || formData.businessName,
        appointment_duration: parseInt(formData.appointmentDuration),
        calendar_link: formData.calendarLink || null,
        pricing_info: formData.pricingInfo || null,
        special_instructions: formData.specialInstructions || null,
        phone_preference: formData.phonePreference as 'new' | 'forward' | 'port',
        existing_phone_number: formData.existingPhoneNumber || null,
        current_phone_provider: formData.currentProvider || null,
        status: "pending" as const,
      };

      // Type assertion needed until database migration is applied
      const { error: insertError } = await supabase
        .from("business_onboarding")
        .insert(insertData as never);

      if (insertError) {
        throw insertError;
      }

      setIsComplete(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          formData.businessName &&
          formData.businessType &&
          (formData.businessType !== "other" || formData.businessTypeOther) &&
          formData.ownerName &&
          formData.email &&
          formData.phone
        );
      case 2:
        const phoneValid = formData.phonePreference === "new" ||
          (formData.phonePreference === "forward" && formData.existingPhoneNumber) ||
          (formData.phonePreference === "port" && formData.existingPhoneNumber);
        return formData.city && formData.state && phoneValid;
      case 3:
        return formData.services.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">You're All Set!</h1>
          <p className="text-lg text-slate-600 mb-6">
            We've received your information and will set up your AI phone agent within 24 hours.
          </p>
          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-slate-900 mb-3">What happens next:</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">1</span>
                </div>
                <span>We'll configure your AI agent with your business info and services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">2</span>
                </div>
                <span>You'll receive a phone number to forward your business calls to</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">3</span>
                </div>
                <span>Test it out and request any adjustments before going live</span>
              </li>
            </ul>
          </div>
          <p className="text-slate-600 mb-6">
            We'll email you at <strong>{formData.email}</strong> with your login credentials and next steps.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#demo">Try AI Demo</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">GreenLine AI</span>
          </Link>
          <div className="text-sm text-slate-600">
            Questions? <a href="tel:+15551234567" className="text-primary-600 font-medium">Call us</a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s < step ? "bg-primary-600 text-white" :
                  s === step ? "bg-primary-600 text-white" :
                  "bg-slate-200 text-slate-600"
                }`}>
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 ${
                    s < step ? "bg-primary-600" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step >= 1 ? "text-primary-600 font-medium" : "text-slate-500"}>Business</span>
            <span className={step >= 2 ? "text-primary-600 font-medium" : "text-slate-500"}>Phone & Area</span>
            <span className={step >= 3 ? "text-primary-600 font-medium" : "text-slate-500"}>Services</span>
            <span className={step >= 4 ? "text-primary-600 font-medium" : "text-slate-500"}>Preferences</span>
          </div>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Step 1: Business Information */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about your business</h2>
              <p className="text-slate-600 mb-8">This helps us customize your AI phone agent.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={formData.businessName}
                      onChange={(e) => updateFormData("businessName", e.target.value)}
                      placeholder="Mike's Landscaping"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type of Business *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => {
                      updateFormData("businessType", e.target.value);
                      // Pre-populate services based on business type
                      const services = defaultServices[e.target.value] || [];
                      updateFormData("services", services);
                    }}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select your industry</option>
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.businessType === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Please specify your business type *
                    </label>
                    <Input
                      value={formData.businessTypeOther}
                      onChange={(e) => updateFormData("businessTypeOther", e.target.value)}
                      placeholder="e.g., Fence Installation"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => updateFormData("ownerName", e.target.value)}
                      placeholder="Mike Johnson"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="mike@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website (optional)
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://mikeslandscaping.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Area & Phone */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Location & Phone Setup</h2>
              <p className="text-slate-600 mb-8">Tell us where you serve and how you want to handle calls.</p>

              <div className="space-y-6">
                {/* Phone Number Preference */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    <Phone className="inline h-4 w-4 mr-1" />
                    How do you want to set up your AI phone line?
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.phonePreference === "new"
                        ? "border-primary-600 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="phonePreference"
                        value="new"
                        checked={formData.phonePreference === "new"}
                        onChange={(e) => updateFormData("phonePreference", e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-medium text-slate-900">Get a new local number</span>
                        <p className="text-sm text-slate-600 mt-1">
                          We'll give you a new local phone number. Forward your existing number to it, or use it as your main line.
                        </p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.phonePreference === "forward"
                        ? "border-primary-600 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="phonePreference"
                        value="forward"
                        checked={formData.phonePreference === "forward"}
                        onChange={(e) => updateFormData("phonePreference", e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-medium text-slate-900">Keep my number, forward calls</span>
                        <p className="text-sm text-slate-600 mt-1">
                          Keep your existing business number. Set up call forwarding to route calls to your AI agent.
                        </p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.phonePreference === "port"
                        ? "border-primary-600 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="phonePreference"
                        value="port"
                        checked={formData.phonePreference === "port"}
                        onChange={(e) => updateFormData("phonePreference", e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-medium text-slate-900">Port my existing number</span>
                        <p className="text-sm text-slate-600 mt-1">
                          Transfer your existing business number to us. The AI will answer calls directly on your current number.
                        </p>
                        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          Takes 1-2 weeks to complete
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {(formData.phonePreference === "forward" || formData.phonePreference === "port") && (
                  <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Existing Business Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.existingPhoneNumber}
                        onChange={(e) => updateFormData("existingPhoneNumber", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {formData.phonePreference === "port" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Phone Provider
                        </label>
                        <Input
                          value={formData.currentProvider}
                          onChange={(e) => updateFormData("currentProvider", e.target.value)}
                          placeholder="e.g., Verizon, AT&T, Google Voice"
                        />
                      </div>
                    )}
                  </div>
                )}

                <hr className="border-slate-200" />

                {/* Service Area */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Austin"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select state</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code (optional)
                  </label>
                  <Input
                    value={formData.zip}
                    onChange={(e) => updateFormData("zip", e.target.value)}
                    placeholder="78701"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Radius (miles)
                  </label>
                  <select
                    value={formData.serviceRadius}
                    onChange={(e) => updateFormData("serviceRadius", e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="10">10 miles</option>
                    <option value="15">15 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="75">75 miles</option>
                    <option value="100">100+ miles</option>
                  </select>
                  <p className="mt-2 text-sm text-slate-500">
                    The AI will ask callers for their location and check if they're in your service area.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">What services do you offer?</h2>
              <p className="text-slate-600 mb-8">Select all services the AI should know about. You can add custom ones too.</p>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {(defaultServices[formData.businessType] || []).map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.services.includes(service)
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>

                {formData.services.filter(s => !defaultServices[formData.businessType]?.includes(s)).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Custom services:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.services
                        .filter(s => !defaultServices[formData.businessType]?.includes(s))
                        .map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white"
                          >
                            {service} ×
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Add a custom service
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={formData.customService}
                        onChange={(e) => updateFormData("customService", e.target.value)}
                        placeholder="e.g., Holiday Lighting"
                        className="pl-10"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomService();
                          }
                        }}
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={addCustomService}>
                      Add
                    </Button>
                  </div>
                </div>

                {formData.services.length > 0 && (
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary-800">
                      {formData.services.length} service{formData.services.length !== 1 ? "s" : ""} selected
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                      Your AI will be able to discuss these services with callers.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Hours & Preferences */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Final details</h2>
              <p className="text-slate-600 mb-8">Help us customize how your AI greets callers and books appointments.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Business Hours
                  </label>
                  <p className="text-sm text-slate-500 mb-3">When can customers book appointments?</p>
                  <div className="grid gap-3">
                    {[
                      { day: "Monday", field: "hoursMonday" },
                      { day: "Tuesday", field: "hoursTuesday" },
                      { day: "Wednesday", field: "hoursWednesday" },
                      { day: "Thursday", field: "hoursThursday" },
                      { day: "Friday", field: "hoursFriday" },
                      { day: "Saturday", field: "hoursSaturday" },
                      { day: "Sunday", field: "hoursSunday" },
                    ].map(({ day, field }) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-24 text-sm text-slate-700">{day}</span>
                        <Input
                          value={formData[field as keyof typeof formData] as string}
                          onChange={(e) => updateFormData(field, e.target.value)}
                          placeholder="8:00 AM - 5:00 PM or Closed"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    AI Greeting Name
                  </label>
                  <Input
                    value={formData.greetingName}
                    onChange={(e) => updateFormData("greetingName", e.target.value)}
                    placeholder={formData.businessName || "e.g., Mike's Landscaping"}
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    How should the AI introduce itself? "Thank you for calling [greeting name]..."
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Default Appointment Length
                  </label>
                  <select
                    value={formData.appointmentDuration}
                    onChange={(e) => updateFormData("appointmentDuration", e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calendar Link (optional)
                  </label>
                  <Input
                    value={formData.calendarLink}
                    onChange={(e) => updateFormData("calendarLink", e.target.value)}
                    placeholder="https://calendly.com/your-business"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    If you use Calendly or Google Calendar, paste the booking link here.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pricing Information (optional)
                  </label>
                  <textarea
                    value={formData.pricingInfo}
                    onChange={(e) => updateFormData("pricingInfo", e.target.value)}
                    placeholder="e.g., Lawn mowing starts at $40. We offer free estimates for larger projects."
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    General pricing the AI can share with callers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => updateFormData("specialInstructions", e.target.value)}
                    placeholder="e.g., Always ask for the property size. Don't schedule same-day appointments."
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((step - 1) as Step)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep((step + 1) as Step)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary-600" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary-600" />
            <span>Setup in 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
