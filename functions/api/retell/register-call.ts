/**
 * Register Web Call API
 * Creates a web call session with Retell AI for browser-based voice calls
 */

interface Env {
  RETELL_API_KEY: string;
}

interface RegisterCallRequest {
  agentId: string;
  metadata?: Record<string, unknown>;
}

interface RetellRegisterResponse {
  access_token: string;
  call_id: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RegisterCallRequest = await request.json();
    const { agentId, metadata } = body;

    if (!agentId) {
      return new Response(
        JSON.stringify({ error: "agentId is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!env.RETELL_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Retell API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Register web call with Retell
    const retellResponse = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        metadata: metadata || {},
      }),
    });

    if (!retellResponse.ok) {
      const errorData = await retellResponse.json().catch(() => ({}));
      console.error("Retell API error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to register call with Retell",
          details: errorData
        }),
        {
          status: retellResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data: RetellRegisterResponse = await retellResponse.json();

    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        call_id: data.call_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Register call error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
