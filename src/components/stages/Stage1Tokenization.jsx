import React from 'react';
import { HudFrame } from '../HudFrame';
import { soundManager } from '../../audio/soundManager';
import { Hash, Layers, Cpu, Sparkles, AlertCircle } from 'lucide-react';

/**
 * Stage 01: Discrete Tokenization Component
 * Displays subword BPE tokenization, token statistics, interactive token inspector,
 * and prompt text input.
 */
export const Stage1Tokenization = ({
  promptText,
  onChangePrompt,
  tokens,
  selectedToken,
  onSelectToken,
  onExecute
}) => {
  const charCount = promptText.length;
  const tokenCount = tokens.length;
  const uniqueTokens = new Set(tokens.map(t => t.cleanText.toLowerCase())).size;
  const subwordCount = tokens.filter(t => t.text.includes('##')).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Prompt Input HUD Frame */}
      <HudFrame
        title="PROMPT INGESTION MATRIX"
        subtitle="STARK NEURAL INPUT BUFFER"
        badge="INPUT STAGE"
        variant="gold"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ENTER TACTICAL QUERY OR SELECT PRESET ABOVE</span>
            <span>{charCount} CHARACTERS // {tokenCount} TOKENS</span>
          </div>

          <div className="relative">
            <textarea
              value={promptText}
              onChange={(e) => onChangePrompt(e.target.value)}
              placeholder="Enter text to analyze through the Transformer pipeline..."
              rows={3}
              className="w-full bg-[#08090f] border border-amber-500/40 rounded-xl p-3.5 font-mono text-sm sm:text-base text-amber-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>BPE VOCABULARY: 50,257 TOKENS (GPT/BERT TACTICAL DICTIONARY)</span>
            </div>

            <button
              onClick={() => {
                soundManager.playExecute();
                onExecute();
              }}
              className="px-4 py-1.5 rounded-lg font-orbitron text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-stark-gold cursor-pointer"
            >
              UPDATE TOKENS
            </button>
          </div>
        </div>
      </HudFrame>

      {/* Token Statistics Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-armor-900/60 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">TOTAL TOKENS</span>
            <span className="font-orbitron font-bold text-lg text-white">{tokenCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-red-500/30 bg-armor-900/60 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">SUBWORD SPLITS</span>
            <span className="font-orbitron font-bold text-lg text-white">{subwordCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-armor-900/60 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">UNIQUE TOKENS</span>
            <span className="font-orbitron font-bold text-lg text-white">{uniqueTokens}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-armor-900/60 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">AVG CHARS/TOKEN</span>
            <span className="font-orbitron font-bold text-lg text-white">
              {tokenCount > 0 ? (charCount / tokenCount).toFixed(1) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Discrete Token Chips Stream */}
      <HudFrame
        title="DISCRETE TOKEN DECOMPOSITION"
        subtitle="CLICK ANY TOKEN TO INSPECT ITS TACTICAL TELEMETRY"
        badge="BYTE-PAIR STREAM"
        variant="red"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-[#08090f] border border-white/10 min-h-[100px] items-center">
            {tokens.map((token) => {
              const isSelected = selectedToken?.id === token.id;
              const isSubword = token.text.includes('##');
              return (
                <button
                  key={token.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectToken(token);
                  }}
                  className={`group relative px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-300 shadow-stark-gold scale-105'
                      : 'bg-armor-800/90 text-slate-200 border-armor-600 hover:border-amber-400/60 hover:bg-armor-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: token.color }}
                  />
                  <span>{token.text}</span>
                  {isSubword && (
                    <span className="text-[9px] opacity-75 font-bold uppercase tracking-tighter">[SUB]</span>
                  )}
                  <span className={`text-[9px] opacity-60 ml-1 ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                    #{token.position}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Inspector Card */}
          {selectedToken ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-armor-900 border border-amber-500/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">TOKEN STRING</span>
                <span className="font-mono text-base font-bold text-amber-300">"{selectedToken.text}"</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">SEQUENCE POSITION</span>
                <span className="font-mono text-base font-bold text-white">Index {selectedToken.position}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">OCCURRENCE FREQ</span>
                <span className="font-mono text-base font-bold text-cyan-300">{selectedToken.frequency}x in prompt</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">BYTE LENGTH</span>
                <span className="font-mono text-base font-bold text-white">{selectedToken.cleanText.length} bytes</span>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-xs font-mono text-slate-500 border border-dashed border-white/10 rounded-lg">
              Click any token above to display its discrete mathematical metadata.
            </div>
          )}
        </div>
      </HudFrame>
    </div>
  );
};
