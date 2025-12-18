'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Key, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface CalComInstructionsProps {
  className?: string;
}

export function CalComInstructions({ className = '' }: CalComInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary-600" />
          <span className="font-medium text-slate-900">How to get your Cal.com API Key</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Quick Overview */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-600" />
              What is Cal.com?
            </h4>
            <p className="text-sm text-slate-600">
              Cal.com is a free scheduling tool (like Calendly) that lets customers book appointments on your calendar.
              By connecting it to your AI agent, customers can book appointments during phone calls automatically.
            </p>
          </div>

          {/* Step by Step Instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Step-by-Step Instructions:</h4>

            {/* Step 1 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Create a Cal.com Account (if you don't have one)</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    Go to{' '}
                    <a
                      href="https://cal.com/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      cal.com/signup
                      <ExternalLink className="h-3 w-3" />
                    </a>{' '}
                    and create a free account. You can sign up with Google or email.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Create an Event Type</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    In Cal.com, create an event type for your service appointments (e.g., "Service Appointment" or "Consultation").
                    Set the duration (typically 30 or 60 minutes) and your available hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Go to Settings → Developer → API Keys</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    Click on your profile picture in the top-right corner, then go to{' '}
                    <strong>Settings</strong> → <strong>Developer</strong> → <strong>API Keys</strong>
                  </p>
                  <div className="mt-2 bg-slate-100 rounded p-2 text-xs font-mono text-slate-700">
                    Profile → Settings → Developer → API Keys
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Create a New API Key</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    Click <strong>"Create new API key"</strong> button. Give it a name like "GreenLine AI" and click Create.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Copy Your API Key</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    <strong className="text-amber-600">Important:</strong> Copy the API key immediately! It starts with{' '}
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">cal_live_</code> and will only be shown once.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900">Paste it Below & Validate</h5>
                  <p className="text-sm text-slate-600 mt-1">
                    Paste the API key in the field below and click "Validate" to confirm it works.
                    Then select which event type you want the AI to use for booking appointments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tips for Best Results
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Make sure your Cal.com availability matches your actual business hours</li>
              <li>Set buffer times between appointments if you need travel time</li>
              <li>Connect Cal.com to your Google or Outlook calendar to avoid double-bookings</li>
              <li>Keep your API key secure - never share it publicly</li>
            </ul>
          </div>

          {/* Don't have Cal.com? */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Don't want to use Cal.com?
            </h4>
            <p className="text-sm text-amber-800">
              No problem! This integration is optional. Without it, your AI agent will collect customer information
              and you can call them back to schedule appointments manually. You can always add Cal.com later.
            </p>
          </div>

          {/* Direct link */}
          <div className="text-center pt-2">
            <a
              href="https://app.cal.com/settings/developer/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Open Cal.com API Keys Page
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalComInstructions;
