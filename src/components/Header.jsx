import React, { useState } from 'react';
import { ArcReactor } from './ArcReactor';
import { soundManager } from '../audio/soundManager';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  Box, 
  Layers, 
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';

/**
 * Stark Industries Tactical HUD Header
 * Shows Mark-LXXXV System Status, Arc Reactor Core diagnostics, and global HUD actions.
 */
export const Header = ({
  viewMode,
  onToggleViewMode,
  onOpenTheory,
  isExecuting,
  currentStage
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleToggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="relative border-b border-amber-500/30 bg-[#080a10]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Stark Brand & Arc Reactor */}
        <div className="flex items-center space-x-3.5">
          <ArcReactor size="sm" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-orbitron font-black tracking-widest text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-amber-300">
                STARK INDUSTRIES
              </span>
              <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-[10px] font-mono font-bold text-red-400 tracking-wider">
                MARK-85
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/90 tracking-wide flex items-center space-x-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>J.A.R.V.I.S. TACTICAL LLM PIPELINE EXPLORER</span>
            </p>
          </div>
        </div>

        {/* Center: Tactical Telemetry Badges */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-2 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-950/30 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ARC CORE: 100%</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded border border-amber-500/30 bg-amber-950/30 text-amber-300">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>NEURAL MATRIX: NOMINAL</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded border border-red-500/30 bg-red-950/30 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>PROTOCOL: ACTIVE</span>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center space-x-2 self-end md:self-center">
          {/* 2D / 3D Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleViewMode();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
              viewMode === '3D' 
                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-400 text-cyan-200 shadow-arc-sm' 
                : 'bg-armor-800 border-amber-500/30 text-amber-300 hover:border-amber-400'
            }`}
            title="Toggle between 3D Universe and 2D Tensor View"
          >
            {viewMode === '3D' ? <Box className="w-3.5 h-3.5 text-cyan-400" /> : <Layers className="w-3.5 h-3.5 text-amber-400" />}
            <span>{viewMode} HUD</span>
          </button>

          {/* Theory Modal Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTheory();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-red-500/40 bg-red-950/50 hover:bg-red-900/60 text-red-200 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">THEORY OF LLMs</span>
            <span className="sm:hidden">THEORY</span>
          </button>

          {/* Audio Mute / Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg border border-armor-700 bg-armor-850 hover:bg-armor-800 text-slate-300 hover:text-amber-300 transition-colors"
            title={isMuted ? "Enable Tactical Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-lg border border-armor-700 bg-armor-850 hover:bg-armor-800 text-slate-300 hover:text-amber-300 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
