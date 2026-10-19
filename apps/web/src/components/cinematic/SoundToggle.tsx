"use client";

import React, { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundFX } from "@/utils/soundFX";

export const SoundToggle: React.FC = () => {
  const muted = useSyncExternalStore(
    (callback) => soundFX.subscribe(callback),
    () => soundFX.isMuted(),
    () => false
  );

  const handleToggle = () => {
    soundFX.toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-8 h-8 rounded-full border-2 border-black transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-90 hover:scale-105 shadow-[2px_2px_0px_#111111] ${
        muted
          ? "bg-white text-black/40 hover:text-black hover:bg-yellow-50"
          : "bg-yellow-400 text-black hover:bg-yellow-300"
      }`}
      title={muted ? "Unmute Sound FX" : "Mute Sound FX"}
      aria-label="Toggle Sound FX"
    >
      {muted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
};
