"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleBookDemo = () => {
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/greenlineai";
    if (calendlyUrl.startsWith("http")) {
      window.open(calendlyUrl, "_blank");
    } else {
      scrollToSection("demo");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white shadow-md py-3"
          : "bg-white/95 backdrop-blur-sm py-4"
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              GreenLine AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              Demo
            </button>
            <a
              href="/contact"
              className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="default" onClick={handleBookDemo}>
              Book Free Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-700 hover:text-primary-600 font-medium text-left transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-slate-700 hover:text-primary-600 font-medium text-left transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("demo")}
                className="text-slate-700 hover:text-primary-600 font-medium text-left transition-colors"
              >
                Demo
              </button>
              <a
                href="/contact"
                className="text-slate-700 hover:text-primary-600 font-medium text-left transition-colors"
              >
                Contact
              </a>
              <Button variant="default" onClick={handleBookDemo} className="w-full">
                Book Free Demo
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
