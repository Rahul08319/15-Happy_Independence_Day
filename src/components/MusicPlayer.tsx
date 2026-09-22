import React from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";

interface MusicPlayerProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  isMuted,
  volume,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}) => {
  return (
    <div
      className="group relative flex items-center gap-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_8px_32px_rgba(245,158,11,0.2)]"
      role="group"
      aria-label="National Song Background Music Controls"
    >
      {/* Animated Wave Indicator / Pulse Icon */}
      <button
        type="button"
        onClick={onTogglePlay}
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 text-white shadow-md transition-transform duration-200 active:scale-95 hover:scale-105"
        aria-label={isPlaying ? "Pause Vande Mataram" : "Play Vande Mataram"}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
        )}
      </button>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-wide text-white/95">
            Vande Mataram
          </span>
          {isPlaying && (
            <span className="flex items-end gap-[2px] h-3 px-1">
              <span className="w-[2px] bg-amber-400 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite]" />
              <span className="w-[2px] bg-white rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.2s]" />
              <span className="w-[2px] bg-emerald-400 rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_0.4s]" />
              <span className="w-[2px] bg-amber-300 rounded-full animate-[music-bar_1.1s_ease-in-out_infinite_0.1s]" />
            </span>
          )}
        </div>
        <span className="text-[10px] text-white/60 font-medium hidden sm:inline">
          Instrumental · Press Space
        </span>
      </div>

      <div className="h-4 w-px bg-white/15 mx-0.5" />

      {/* Mute Button */}
      <button
        type="button"
        onClick={onToggleMute}
        className="p-1 rounded-full text-white/70 hover:text-white transition-colors hover:bg-white/10"
        title="Mute / Unmute (M)"
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-4 w-4 text-red-400" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Volume Slider */}
      <div className="flex items-center w-16 sm:w-20">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-amber-400 transition-all focus:outline-none"
          aria-label="Volume slider"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
