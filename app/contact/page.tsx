"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "(626) 225-8141",
      href: "tel:+16262258141",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@greenline-ai.com",
      href: "mailto:contact@greenline-ai.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "3129 S. Hacienda Blvd #524\nHacienda Heights, CA 91745",
      href: null,
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon - Fri: 9am - 6pm PST\n(AI available 24/7)",
      href: null,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Get In <span className="text-primary-600">Touch</span>
              </h1>
              <p className="text-xl text-slate-600">
                Have questions about how GreenLine AI can help your landscaping
                business? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        Message Sent!
                      </h3>
                      <p className="text-slate-600 mb-6">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            company: "",
                            message: "",
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-slate-700 mb-2"
                            >
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              placeholder="John Smith"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-slate-700 mb-2"
                            >
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-slate-700 mb-2"
                            >
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="company"
                              className="block text-sm font-medium text-slate-700 mb-2"
                            >
                              Company Name
                            </label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              placeholder="Smith Landscaping"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-slate-700 mb-2"
                          >
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            placeholder="Tell us about your landscaping business and how we can help..."
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="default"
                          size="lg"
                          className="w-full gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </Card>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                      <Card
                        key={index}
                        className={`p-6 flex items-start gap-4 ${item.href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}`}
                      >
                        <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">
                            {item.label}
                          </div>
                          <div className="text-slate-900 font-semibold whitespace-pre-line">
                            {item.value}
                          </div>
                        </div>
                      </Card>
                    );

                    return item.href ? (
                      <a
                        key={index}
                        href={item.href}
                        className="block hover:no-underline"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    );
                  })}
                </div>

                {/* CTA Card */}
                <Card className="mt-8 p-8 bg-gradient-to-br from-primary-600 to-primary-700 border-0">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Ready to See a Demo?
                  </h3>
                  <p className="text-primary-100 mb-6">
                    Call our AI demo line right now and experience the future of
                    landscaping customer service.
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() =>
                      (window.location.href = "tel:+16262258141")
                    }
                  >
                    <Phone className="h-5 w-5" />
                    Call (626) 225-8141
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Location
              </h2>
              <p className="text-slate-600">
                Based in Southern California, serving landscaping businesses
                nationwide.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.8973!2d-117.9689!3d33.9925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2d4d5c9e7e8e9%3A0x0!2s3129+S+Hacienda+Blvd%2C+Hacienda+Heights%2C+CA+91745!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GreenLine AI Office Location"
                className="absolute inset-0"
              />
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-600">
              <MapPin className="h-5 w-5 text-primary-600" />
              <span className="font-medium">3129 S. Hacienda Blvd #524, Hacienda Heights, CA 91745</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
