"use client";

import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Mike Rodriguez",
      company: "Rodriguez Landscaping",
      location: "Austin, TX",
      rating: 5,
      text: "I used to miss 5-10 calls a day while on job sites. Now every call gets answered and I've booked 30% more jobs. The AI sounds so natural, customers don't even know.",
      image: null,
    },
    {
      name: "Sarah Mitchell",
      company: "Mitchell's Lawn Care",
      location: "Denver, CO",
      rating: 5,
      text: "Best money I've ever spent on my business. I was paying my wife to answer phones part-time. Now the AI handles everything and actually books more appointments than she did!",
      image: null,
    },
    {
      name: "James Chen",
      company: "Premier Tree Service",
      location: "Phoenix, AZ",
      rating: 5,
      text: "Within the first week, the AI booked 8 tree removal jobs I would have missed. At $400 average per job, it paid for itself in 2 days. Should have done this years ago.",
      image: null,
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Home Services Pros
          </h2>
          <p className="text-xl text-slate-600">
            See how landscapers and contractors are booking more jobs with AI
          </p>
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 flex flex-col hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent-500 text-accent-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 flex-grow leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.company}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile: Carousel/Stack */}
        <div className="md:hidden space-y-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent-500 text-accent-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.company}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom stat */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center text-primary-600 font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>Join 200+ home services businesses never missing calls</span>
          </div>
        </div>
      </div>
    </section>
  );
}
