"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { RetellWebClient } from "retell-client-js-sdk";

const RETELL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID || "";

interface RegisterCallResponse {
  access_token: string;
  call_id: string;
}

export default function RetellDemo() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusText, setStatusText] = useState("Click to talk to our AI");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const retellClientRef = useRef<RetellWebClient | null>(null);

  // Check for missing configuration
  const isMissingConfig = !RETELL_AGENT_ID;

  useEffect(() => {
    if (isMissingConfig) {
      setErrorMessage("Voice AI is not configured. Please contact support.");
      return;
    }

    const retellClient = new RetellWebClient();

    retellClient.on("call_started", () => {
      setIsConnecting(false);
      setIsSessionActive(true);
      setErrorMessage(null);
      setStatusText("Connected - Start speaking!");
    });

    retellClient.on("call_ended", () => {
      setIsSessionActive(false);
      setIsConnecting(false);
      setStatusText("Call ended - Click to try again");
    });

    retellClient.on("agent_start_talking", () => {
      setStatusText("AI is speaking...");
    });

    retellClient.on("agent_stop_talking", () => {
      setStatusText("Listening...");
    });

    retellClient.on("audio", (audio: Uint8Array) => {
      // Calculate volume level from audio data
      const sum = audio.reduce((acc, val) => acc + Math.abs(val - 128), 0);
      const avgVolume = sum / audio.length / 128;
      setVolumeLevel(avgVolume);
    });

    retellClient.on("error", (error: Error) => {
      console.error("Retell error:", error);
      setIsConnecting(false);
      setIsSessionActive(false);
      setErrorMessage(error.message || "Connection failed - Please try again");
      setStatusText("Error occurred");
    });

    retellClientRef.current = retellClient;

    return () => {
      retellClient.stopCall();
    };
  }, [isMissingConfig]);

  const startCall = useCallback(async () => {
    if (!retellClientRef.current || isSessionActive || isConnecting) return;

    setIsConnecting(true);
    setStatusText("Connecting...");
    setErrorMessage(null);

    try {
      // Register the web call via our backend API
      const response = await fetch("/api/retell/register-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: RETELL_AGENT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register call");
      }

      const data: RegisterCallResponse = await response.json();

      // Start the call with the access token
      await retellClientRef.current.startCall({
        accessToken: data.access_token,
        sampleRate: 24000,
        captureDeviceId: "default",
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to start call"
      );
      setStatusText("Click to talk to our AI");
    }
  }, [isSessionActive, isConnecting]);

  const endCall = useCallback(() => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
      setIsSessionActive(false);
      setStatusText("Click to talk to our AI");
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (retellClientRef.current && isSessionActive) {
      const newMuteState = !isMuted;
      if (newMuteState) {
        retellClientRef.current.mute();
      } else {
        retellClientRef.current.unmute();
      }
      setIsMuted(newMuteState);
    }
  }, [isMuted, isSessionActive]);

  return (
    <div className="flex flex-col items-center">
      {/* Main call button */}
      <div className="relative mb-6">
        {/* Animated ring when active */}
        {isSessionActive && (
          <div
            className="absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-20"
            style={{ transform: `scale(${1 + volumeLevel * 0.5})` }}
          />
        )}

        <button
          onClick={isSessionActive ? endCall : startCall}
          disabled={isConnecting || isMissingConfig}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-2xl
            ${isMissingConfig
              ? "bg-slate-500 cursor-not-allowed"
              : isConnecting
                ? "bg-yellow-500 cursor-wait"
                : isSessionActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-accent-500 hover:bg-accent-600 hover:scale-105"
            }
          `}
        >
          {isConnecting ? (
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSessionActive ? (
            <PhoneOff className="h-12 w-12 text-white" />
          ) : (
            <Phone className="h-12 w-12 text-white" />
          )}
        </button>
      </div>

      {/* Status text */}
      <p className="text-lg font-medium text-white mb-4">
        {statusText}
      </p>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg max-w-xs">
          <p className="text-red-300 text-sm text-center">{errorMessage}</p>
        </div>
      )}

      {/* Volume indicator */}
      {isSessionActive && (
        <div className="w-48 mb-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-400 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Mute button when active */}
      {isSessionActive && (
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 text-white bg-transparent hover:bg-white/10 transition-colors"
        >
          {isMuted ? (
            <>
              <MicOff className="h-4 w-4" />
              Unmute
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Mute
            </>
          )}
        </button>
      )}

      {/* Instructions */}
      {!isSessionActive && !isConnecting && (
        <p className="text-sm text-slate-400 mt-4 text-center max-w-xs">
          Your browser will request microphone access to talk with the AI
        </p>
      )}
    </div>
  );
}
