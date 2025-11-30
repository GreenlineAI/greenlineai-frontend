'use client';

import { ShieldX, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Access Denied
        </h1>

        <p className="text-slate-300 mb-8">
          Your account is not authorized to access the CRM dashboard.
          Please contact your administrator to request access.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>

          <a href="mailto:admin@revues.ai?subject=Dashboard%20Access%20Request">
            <Button variant="default" className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Request Access
            </Button>
          </a>
        </div>

        <p className="text-sm text-slate-500 mt-8">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
