"use client";

import { Sprout, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GreenLine AI</span>
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              AI Voice Agents for Landscaping Businesses
            </p>
            <p className="text-sm text-slate-500">
              Never miss another lead. Capture more revenue with 24/7 AI phone
              answering.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#faq"
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#case-studies"
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="text-slate-400 hover:text-primary-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@greenline-ai.com"
                  className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  contact@greenline-ai.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+14083654503"
                  className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (408) 365-4503
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>123 Business Ave<br />Suite 100<br />San Francisco, CA 94105</span>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} GreenLine AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#privacy"
                className="text-slate-500 hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-slate-500 hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-slate-500 hover:text-primary-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
