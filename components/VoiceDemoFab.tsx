"use client";

import { useState, useEffect } from "react";
import { Headphones, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function VoiceDemoFab() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  // Don't show on the voice demo page itself
  const isVoiceDemoPage = pathname === "/demo/voice";

  useEffect(() => {
    // Show the FAB after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isVoiceDemoPage || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-[200px] relative animate-fade-in">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
        <p>Have questions? Talk to our AI</p>
      </div>

      {/* FAB Button */}
      <Link
        href="/demo/voice"
        className="group flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <Headphones className="h-6 w-6" />
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
        </div>
        <span className="font-medium">Ask AI</span>
      </Link>
    </div>
  );
}
