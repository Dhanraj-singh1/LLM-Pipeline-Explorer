import React, { useState } from 'react';
import { THEORY_MODULES } from '../data/theoryData';
import { soundManager } from '../audio/soundManager';
import { X, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import katex from 'katex';

/**
 * KaTeX Formula Renderer Component
 */
const MathFormula = ({ math, block = true }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} className="overflow-x-auto py-1" />;
  } catch (err) {
    return <code className="text-amber-300 font-mono text-xs">{math}</code>;
  }
};

/**
 * Theory of Large Language Models Modal
 * In-depth educational reference covering all 8 Transformer modules
 * with LaTeX equations, concept summaries, and key principles.
 */
export const TheoryModal = ({ isOpen, onClose }) => {
  const [selectedModuleId, setSelectedModuleId] = useState(THEORY_MODULES[0].id);

  if (!isOpen) return null;

  const currentModule = THEORY_MODULES.find(m => m.id === selectedModuleId) || THEORY_MODULES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/40 bg-[#090b14] shadow-2xl overflow-hidden hud-corner">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-armor-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wider flex items-center space-x-2">
                <span>THEORY OF LARGE LANGUAGE MODELS</span>
                <span className="text-xs font-mono text-amber-400 font-normal">// ARCHITECTURE COMPENDIUM</span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Mathematical foundations of Self-Attention, BPE Tokenization &amp; Generative Decoding
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-armor-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-column layout (Module list + Detail card) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Module List (4 cols) */}
          <div className="md:col-span-4 border-r border-armor-800 p-4 space-y-2 bg-[#06080e]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2 px-1">
              CURRICULUM MODULES
            </span>
            {THEORY_MODULES.map((mod, idx) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedModuleId(mod.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-stark-gold'
                      : 'bg-armor-900/50 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-armor-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                      {mod.category}
                    </span>
                    <span className="text-[9px] text-slate-500">#{idx + 1}</span>
                  </div>
                  <span className="font-orbitron font-bold text-white text-xs line-clamp-1">
                    {mod.title}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {mod.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-6 overflow-y-auto bg-[#090b14]">
            {/* Header info */}
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300 uppercase tracking-widest">
                {currentModule.category}
              </span>
              <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white mt-2">
                {currentModule.title}
              </h3>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                // {currentModule.subtitle}
              </p>
            </div>

            {/* Governing Equation in KaTeX Math */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#06070c] shadow-stark-gold text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                GOVERNING MATHEMATICAL EQUATION
              </span>
              <div className="text-base sm:text-lg text-amber-200 py-1">
                <MathFormula math={currentModule.formula} block={true} />
              </div>
            </div>

            {/* Concept Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                CONCEPT OVERVIEW
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {currentModule.summary}
              </p>
            </div>

            {/* Key Principles */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                KEY PRINCIPLES &amp; MECHANICS
              </h4>
              <div className="space-y-2">
                {currentModule.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-armor-900/60 border border-white/10 flex items-start space-x-3 text-xs text-slate-300 font-sans"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
