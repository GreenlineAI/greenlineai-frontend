/**
 * POST /api/calendar/validate-key
 *
 * Validates a Cal.com API key by testing it against the Cal.com API.
 * Returns user info if valid, error message if not.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCalComApiKey } from '@/lib/cal-com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate the API key against Cal.com
    const result = await validateCalComApiKey(apiKey);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        user: {
          email: result.user?.email,
          name: result.user?.name,
          timeZone: result.user?.timeZone,
        },
      });
    } else {
      return NextResponse.json({
        valid: false,
        error: result.error || 'Invalid API key',
      });
    }
  } catch (error) {
    console.error('[Calendar Validate Key] Error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : 'Failed to validate API key',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/calendar/validate-key',
    method: 'POST',
    description: 'Validate a Cal.com API key',
  });
}
