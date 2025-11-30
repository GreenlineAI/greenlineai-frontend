"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

export default function VapiDemo() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusText, setStatusText] = useState("Click to talk to our AI");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  // Check for missing configuration
  const isMissingConfig = !VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID;

  useEffect(() => {
    if (isMissingConfig) {
      setErrorMessage("Voice AI is not configured. Please contact support.");
      return;
    }

    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

    vapiInstance.on("call-start", () => {
      setIsConnecting(false);
      setIsSessionActive(true);
      setErrorMessage(null);
      setStatusText("Connected - Start speaking!");
    });

    vapiInstance.on("call-end", () => {
      setIsSessionActive(false);
      setIsConnecting(false);
      setStatusText("Call ended - Click to try again");
    });

    vapiInstance.on("speech-start", () => {
      setStatusText("AI is speaking...");
    });

    vapiInstance.on("speech-end", () => {
      setStatusText("Listening...");
    });

    vapiInstance.on("volume-level", (volume: number) => {
      setVolumeLevel(volume);
    });

    vapiInstance.on("error", (error: unknown) => {
      console.error("Vapi error:", error);
      setIsConnecting(false);
      setIsSessionActive(false);

      // Extract meaningful error message
      let message = "Connection failed - Please try again";
      if (error && typeof error === "object") {
        const err = error as { message?: string; error?: { message?: string }; statusCode?: number };
        if (err.message) {
          message = err.message;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        if (err.statusCode === 401) {
          message = "Authentication failed - Invalid API key";
        } else if (err.statusCode === 404) {
          message = "Assistant not found - Check configuration";
        }
      }
      setErrorMessage(message);
      setStatusText("Error occurred");
    });

    vapiRef.current = vapiInstance;

    return () => {
      vapiInstance.stop();
    };
  }, [isMissingConfig]);

  const startCall = useCallback(() => {
    if (vapiRef.current && !isSessionActive && !isConnecting) {
      setIsConnecting(true);
      setStatusText("Connecting...");
      vapiRef.current.start(VAPI_ASSISTANT_ID);
    }
  }, [isSessionActive, isConnecting]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setIsSessionActive(false);
      setStatusText("Click to talk to our AI");
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current && isSessionActive) {
      const newMuteState = !isMuted;
      vapiRef.current.setMuted(newMuteState);
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
        <Button
          variant="outline"
          onClick={toggleMute}
          className="gap-2 border-white/30 text-white hover:bg-white/10"
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
        </Button>
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
