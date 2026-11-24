import React from 'react';
import { PRESETS } from '../data/presets';
import { soundManager } from '../audio/soundManager';
import { Cpu, Sparkles } from 'lucide-react';

/**
 * Iron Man Tactical Preset Selector
 * Allows one-click loading of foundational prompts & Stark neural protocols
 */
export const PresetSelector = ({ selectedPresetId, onSelectPreset }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/90 font-bold flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-red-500" />
          <span>NEURAL BENCHMARK PRESETS</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          SELECT TACTICAL PROMPT TO LOAD
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => {
                soundManager.playClick();
                onSelectPreset(preset);
              }}
              className={`p-3.5 rounded-xl border bg-gradient-to-b ${preset.color} backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/80 ${
                isSelected 
                  ? 'ring-2 ring-amber-400/80 border-amber-400 shadow-stark-gold' 
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${preset.badgeColor}`}>
                  {preset.tag}
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {preset.category}
                </span>
              </div>
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-white line-clamp-1">
                {preset.title}
              </h4>
              <p className="text-[11px] font-sans text-slate-300/80 line-clamp-2 mt-1 leading-snug">
                "{preset.text}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
