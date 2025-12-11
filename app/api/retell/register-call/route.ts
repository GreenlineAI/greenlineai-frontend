import { NextRequest, NextResponse } from "next/server";

interface RegisterCallRequest {
  agentId: string;
  metadata?: Record<string, unknown>;
}

interface RetellRegisterResponse {
  access_token: string;
  call_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterCallRequest = await request.json();
    const { agentId, metadata } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: "agentId is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Retell API key not configured" },
        { status: 500 }
      );
    }

    // Register web call with Retell
    const retellResponse = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          metadata: metadata || {},
        }),
      }
    );

    if (!retellResponse.ok) {
      const errorData = await retellResponse.json().catch(() => ({}));
      console.error("Retell API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to register call with Retell",
          details: errorData,
        },
        { status: retellResponse.status }
      );
    }

    const data: RetellRegisterResponse = await retellResponse.json();

    return NextResponse.json({
      access_token: data.access_token,
      call_id: data.call_id,
    });
  } catch (error) {
    console.error("Register call error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
