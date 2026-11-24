import React from 'react';

/**
 * Animated Arc Reactor Component
 * Represents Tony Stark's clean energy core and JARVIS neural processor
 */
export const ArcReactor = ({ size = "md", pulse = true, className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32"
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse"></div>

      {/* Outer Golden Ring with tick marks */}
      <div className="absolute inset-0 rounded-full border border-amber-500/40 animate-hud-spin">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-amber-400"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-amber-400"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-amber-400"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-amber-400"></div>
      </div>

      {/* Middle Rotating Cyan Segmented Ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/60 animate-hud-spin-reverse"></div>

      {/* Hexagonal / Radial Segment Mesh */}
      <div className="absolute inset-2 rounded-full border border-red-500/30"></div>

      {/* Core Energy Center */}
      <div className="relative w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-cyan-400 to-white shadow-arc flex items-center justify-center">
        <div className="w-2/3 h-2/3 rounded-full bg-cyan-950/80 border border-cyan-300 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-arc animate-ping"></div>
        </div>
      </div>
    </div>
  );
};
