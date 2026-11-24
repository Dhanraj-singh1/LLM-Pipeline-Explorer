import React, { useState } from 'react';
import { HudFrame } from '../HudFrame';
import { ThreeUniverse } from '../ThreeUniverse';
import { soundManager } from '../../audio/soundManager';
import { cosineSimilarity } from '../../utils/llmCalculations';
import { Box, Grid, Compass, Network } from 'lucide-react';

/**
 * Stage 02 & 03: Vector Embeddings & Positional Encodings
 * Includes 3D Universe, 2D Tensor Heatmap, Sinusoidal PE Formula breakdown,
 * and Cosine Similarity Matrix.
 */
export const Stage2Embedding = ({
  tokens,
  selectedToken,
  onSelectToken,
  viewMode,
  onToggleViewMode
}) => {
  const [activeTab, setActiveTab] = useState("3d");

  const tabs = [
    { id: "3d", label: "3D UNIVERSE", icon: Box },
    { id: "heatmap", label: "2D TENSOR HEATMAP", icon: Grid },
    { id: "positional", label: "PE FORMULA", icon: Compass },
    { id: "similarity", label: "COSINE SIMILARITY", icon: Network }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-armor-900/70 border border-armor-700">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-stark-gold font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-armor-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[10px] font-mono text-slate-500 pr-2 hidden sm:inline">
          EMBEDDING DIM: 16-D // CONTINUOUS GEOMETRY
        </span>
      </div>

      {/* Tab Content 1: 3D Universe */}
      {activeTab === "3d" && (
        <ThreeUniverse
          tokens={tokens}
          selectedToken={selectedToken}
          onSelectToken={onSelectToken}
        />
      )}

      {/* Tab Content 2: 2D Tensor Heatmap */}
      {activeTab === "heatmap" && (
        <HudFrame
          title="HIGH-DIMENSIONAL EMBEDDING TENSOR MATRIX"
          subtitle="CONTINUOUS LATENT VALUES ACROSS 16 DIMENSIONS"
          badge="16-D TENSOR"
          variant="cyan"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="p-2.5 text-left">TOKEN</th>
                  {Array.from({ length: 16 }).map((_, d) => (
                    <th key={d} className="p-2 text-center text-[10px] text-cyan-400">
                      d_{d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => {
                  const isSelected = selectedToken?.id === token.id;
                  return (
                    <tr
                      key={token.id}
                      onClick={() => {
                        soundManager.playClick();
                        onSelectToken(token);
                      }}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-500/20' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="p-2.5 font-bold text-white whitespace-nowrap flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: token.color }}></span>
                        <span>"{token.cleanText}"</span>
                      </td>
                      {token.finalEmbedding.map((val, idx) => {
                        const isPositive = val >= 0;
                        const intensity = Math.min(1, Math.abs(val) * 1.2);
                        return (
                          <td key={idx} className="p-1.5 text-center">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isPositive 
                                  ? 'bg-cyan-500/30 text-cyan-200' 
                                  : 'bg-red-500/30 text-red-200'
                              }`}
                              style={{ opacity: 0.4 + intensity * 0.6 }}
                            >
                              {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </HudFrame>
      )}

      {/* Tab Content 3: Sinusoidal PE Formula */}
      {activeTab === "positional" && (
        <HudFrame
          title="SINUSOIDAL POSITIONAL ENCODINGS (PE)"
          subtitle="INJECTING SEQUENCE ORDER INTO ATTENTION MATRICES"
          badge="MATH DERIVATION"
          variant="gold"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090b12] border border-amber-500/30 font-mono text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                VASWANI ET AL. SINUSOIDAL FORMULATION
              </span>
              <div className="text-sm sm:text-base text-amber-300 py-1">
                PE(pos, 2i) = sin(pos / 10000^(2i/d)), &nbsp;&nbsp; PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="p-2.5 text-left">POS</th>
                    <th className="p-2.5 text-left">TOKEN</th>
                    {Array.from({ length: 8 }).map((_, d) => (
                      <th key={d} className="p-2 text-center text-[10px] text-amber-400">
                        {d % 2 === 0 ? `sin(2i=${d})` : `cos(2i+1=${d})`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token) => (
                    <tr key={token.id} className="border-b border-white/5">
                      <td className="p-2.5 text-amber-400 font-bold">{token.position}</td>
                      <td className="p-2.5 text-white font-bold">"{token.cleanText}"</td>
                      {token.positionalEmbedding.slice(0, 8).map((val, idx) => (
                        <td key={idx} className="p-1.5 text-center">
                          <span className="text-[10px] text-slate-300">
                            {val.toFixed(3)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </HudFrame>
      )}

      {/* Tab Content 4: Cosine Similarity Matrix */}
      {activeTab === "similarity" && (
        <HudFrame
          title="SEMANTIC COSINE SIMILARITY MATRIX"
          subtitle="DOT PRODUCT / (||A|| * ||B||) ACROSS ALL TOKENS"
          badge="GEOMETRIC SIMILARITY"
          variant="cyan"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="p-2 text-left">T_i \ T_j</th>
                  {tokens.map((t) => (
                    <th key={t.id} className="p-2 text-center text-[10px] text-cyan-300 whitespace-nowrap">
                      {t.cleanText}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((rowToken) => (
                  <tr key={rowToken.id} className="border-b border-white/5">
                    <td className="p-2 font-bold text-white whitespace-nowrap">
                      "{rowToken.cleanText}"
                    </td>
                    {tokens.map((colToken) => {
                      const sim = cosineSimilarity(rowToken.finalEmbedding, colToken.finalEmbedding);
                      const isSelf = rowToken.id === colToken.id;
                      return (
                        <td key={colToken.id} className="p-1.5 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isSelf
                                ? 'bg-amber-500/40 text-amber-200'
                                : sim > 0.4
                                ? 'bg-cyan-500/40 text-cyan-100'
                                : 'bg-armor-800 text-slate-400'
                            }`}
                          >
                            {sim.toFixed(2)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </HudFrame>
      )}
    </div>
  );
};
