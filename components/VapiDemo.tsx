"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import Button from "./ui/Button";

const VAPI_PUBLIC_KEY = "5a74530e-4e86-4454-b6dc-c2faa23558fa";
const VAPI_ASSISTANT_ID = "fdd6899b-1426-4f3c-83bd-5288fa581c72";

export default function VapiDemo() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusText, setStatusText] = useState("Click to talk to our AI");
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

    vapiInstance.on("call-start", () => {
      setIsConnecting(false);
      setIsSessionActive(true);
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

    vapiInstance.on("error", (error: Error) => {
      console.error("Vapi error:", error);
      setIsConnecting(false);
      setIsSessionActive(false);
      setStatusText("Error occurred - Please try again");
    });

    vapiRef.current = vapiInstance;

    return () => {
      vapiInstance.stop();
    };
  }, []);

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
          disabled={isConnecting}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-2xl
            ${isConnecting
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
