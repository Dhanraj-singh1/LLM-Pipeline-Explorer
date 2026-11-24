import React from 'react';

/**
 * Iron Man / Stark Industries Tactical HUD Frame
 * Renders corner reticles, technical telemetry labels, and glowing borders
 */
export const HudFrame = ({
  children,
  title,
  subtitle,
  badge,
  variant = "gold", // "gold" | "red" | "cyan"
  className = "",
  cornerClass = "hud-corner"
}) => {
  const borderVariants = {
    gold: "border-amber-500/30 bg-[#0c0e16]/80 shadow-stark-gold",
    red: "border-red-500/40 bg-[#12080a]/80 shadow-stark-red",
    cyan: "border-cyan-500/30 bg-[#07131a]/80 shadow-arc",
  };

  const cornerVariants = {
    gold: "hud-corner",
    red: "hud-corner-red",
    cyan: "hud-corner-cyan"
  };

  const activeCorner = cornerVariants[variant] || cornerClass;

  return (
    <div className={`relative rounded-xl border backdrop-blur-md transition-all duration-300 ${borderVariants[variant]} ${activeCorner} ${className}`}>
      {/* Top telemetry bar */}
      {(title || badge) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-sm ${variant === 'red' ? 'bg-red-500' : variant === 'cyan' ? 'bg-cyan-400' : 'bg-amber-400'} animate-pulse`} />
            {title && (
              <h3 className="font-orbitron text-xs sm:text-sm font-bold tracking-wider text-white uppercase flex items-center space-x-2">
                <span>{title}</span>
                {subtitle && <span className="text-[10px] font-mono text-slate-400 font-normal lowercase">// {subtitle}</span>}
              </h3>
            )}
          </div>
          {badge && (
            <span className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded border border-white/20 bg-white/5 text-slate-300 uppercase">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Main Container Content */}
      <div className="p-4 sm:p-5">
        {children}
      </div>

      {/* Bottom Technical Crosshair Tick */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center space-x-1 text-[8px] font-mono text-amber-500/40 select-none pointer-events-none">
        <span>+</span>
        <span className="tracking-tighter">MARK-85</span>
        <span>+</span>
      </div>
    </div>
  );
};
