"use client";

import Link from "next/link";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "./NotificationBell";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b bg-slate-900 px-4 lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-slate-800"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-white">GreenLine AI</span>
      </Link>

      <NotificationBell className="text-white hover:bg-slate-800" />
    </div>
  );
}
