import React, { useState } from 'react';
import { HudFrame } from '../HudFrame';
import { ThreeAttentionArcs } from '../ThreeAttentionArcs';
import { soundManager } from '../../audio/soundManager';
import { Grid, Eye, Cpu, BookOpen, Sliders, Shield } from 'lucide-react';

/**
 * Stage 04: Scaled Dot-Product Multi-Head Attention
 * Displays 2D Attention Heatmap, 3D Attention Arcs, QKV Tensors,
 * Causal mask toggle, and Attention Threshold slider.
 */
export const Stage3Attention = ({
  tokens,
  attentionData,
  causalMask,
  onToggleCausalMask,
  threshold,
  onChangeThreshold,
  selectedToken,
  onSelectToken
}) => {
  const [activeTab, setActiveTab] = useState("heatmap");
  const [selectedHead, setSelectedHead] = useState(-1); // -1 is Average of all heads
  const [hoveredCell, setHoveredCell] = useState(null);

  const tabs = [
    { id: "heatmap", label: "2D ATTENTION HEATMAP", icon: Grid },
    { id: "3d", label: "3D ATTENTION ARCS", icon: Eye },
    { id: "qkv", label: "Q, K, V TENSORS", icon: Cpu },
    { id: "math", label: "FORMULA DERIVATION", icon: BookOpen }
  ];

  // Pick active matrix based on selected head
  const activeMatrix = selectedHead >= 0 && attentionData.heads[selectedHead]
    ? attentionData.heads[selectedHead].attentionWeights
    : attentionData.averageMatrix;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Sub-tab Navigation */}
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

        {/* Causal Mask Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleCausalMask();
          }}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            causalMask
              ? 'bg-red-950/80 border-red-500 text-red-300 shadow-stark-red'
              : 'bg-armor-800 border-armor-600 text-slate-300 hover:border-amber-400'
          }`}
          title="Toggle between GPT-style causal autoregressive mask and BERT-style bidirectional attention"
        >
          <Shield className={`w-3.5 h-3.5 ${causalMask ? 'text-red-400' : 'text-slate-400'}`} />
          <span>CAUSAL MASK: {causalMask ? 'ON (GPT)' : 'OFF (BERT)'}</span>
        </button>
      </div>

      {/* Head Selector & Threshold Slider Controls */}
      <div className="p-4 rounded-xl bg-armor-900/50 border border-armor-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Head selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mr-1">
            HEAD:
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedHead(-1);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ${
              selectedHead === -1
                ? 'bg-amber-500 text-black border-amber-400 shadow-stark-gold'
                : 'bg-armor-800 border-armor-600 text-slate-400 hover:text-slate-200'
            }`}
          >
            AVG (ALL 4 HEADS)
          </button>
          {attentionData.heads.map((h) => (
            <button
              key={h.headIndex}
              onClick={() => {
                soundManager.playClick();
                setSelectedHead(h.headIndex);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                selectedHead === h.headIndex
                  ? 'bg-amber-500 text-black border-amber-400 shadow-stark-gold font-bold'
                  : 'bg-armor-800 border-armor-600 text-slate-400 hover:text-slate-200'
              }`}
            >
              Head {h.headIndex + 1}
            </button>
          ))}
        </div>

        {/* Attention Threshold Filter Slider */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 whitespace-nowrap">THRESHOLD:</span>
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.02"
            value={threshold}
            onChange={(e) => onChangeThreshold(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-amber-400 cursor-pointer"
          />
          <span className="text-amber-400 font-bold min-w-[36px]">
            {(threshold * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Tab 1: 2D Heatmap */}
      {activeTab === "heatmap" && (
        <HudFrame
          title="ATTENTION WEIGHT HEATMAP MATRIX"
          subtitle="TOKEN-TO-TOKEN SOFTMAX WEIGHTS"
          badge="Q · K^T / sqrt(d_k)"
          variant="gold"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="p-2 text-left">Query (i) \ Key (j)</th>
                    {tokens.map((t) => (
                      <th key={t.id} className="p-2 text-center text-[10px] text-amber-300 whitespace-nowrap">
                        {t.cleanText}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((qToken, i) => (
                    <tr key={qToken.id} className="border-b border-white/5">
                      <td className="p-2 font-bold text-white whitespace-nowrap">
                        "{qToken.cleanText}"
                      </td>
                      {tokens.map((kToken, j) => {
                        const weight = activeMatrix[i]?.[j] ?? 0;
                        const isFiltered = weight < threshold;
                        const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;
                        return (
                          <td
                            key={kToken.id}
                            onMouseEnter={() => setHoveredCell({ i, j, weight, q: qToken.cleanText, k: kToken.cleanText })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className="p-1.5 text-center cursor-pointer"
                          >
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                isHovered
                                  ? 'ring-2 ring-white scale-125 z-10'
                                  : ''
                              } ${
                                isFiltered
                                  ? 'opacity-20 text-slate-600 bg-transparent'
                                  : weight > 0.3
                                  ? 'bg-amber-400 text-black font-extrabold shadow-stark-gold'
                                  : weight > 0.15
                                  ? 'bg-amber-600/70 text-white'
                                  : 'bg-red-950/60 text-red-200'
                              }`}
                            >
                              {(weight * 100).toFixed(0)}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cell Tooltip Hover Feedback */}
            {hoveredCell && (
              <div className="p-3 rounded-lg bg-[#090b14] border border-amber-500/40 text-xs font-mono text-center text-amber-300">
                Token <span className="font-bold text-white">"{hoveredCell.q}"</span> attends to <span className="font-bold text-white">"{hoveredCell.k}"</span> with weight <span className="font-bold text-cyan-300">{(hoveredCell.weight * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </HudFrame>
      )}

      {/* Tab 2: 3D Attention Arcs */}
      {activeTab === "3d" && (
        <ThreeAttentionArcs
          tokens={tokens}
          attentionData={attentionData}
          threshold={threshold}
        />
      )}

      {/* Tab 3: QKV Tensors */}
      {activeTab === "qkv" && (
        <HudFrame
          title="Q, K, V PROJECTION SUBSPACES"
          subtitle="4-DIMENSIONAL SUBSPACE VECTORS PER HEAD"
          badge="W_Q, W_K, W_V"
          variant="cyan"
        >
          <div className="space-y-4">
            <p className="text-xs font-mono text-slate-400">
              Showing Query (Q), Key (K), and Value (V) projections for each token under the active attention head:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-armor-900/60 border border-amber-500/30">
                <span className="font-orbitron text-xs font-bold text-amber-400 block mb-2">QUERY (Q) TENSORS</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {tokens.map((t, idx) => (
                    <div key={t.id} className="flex justify-between border-b border-white/5 py-0.5">
                      <span className="text-slate-300 font-bold">{t.cleanText}:</span>
                      <span className="text-amber-300 font-mono text-[10px]">
                        [{attentionData.heads[0]?.Q[idx]?.map(v => v.toFixed(2)).join(', ') || '0.00'}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-armor-900/60 border border-cyan-500/30">
                <span className="font-orbitron text-xs font-bold text-cyan-400 block mb-2">KEY (K) TENSORS</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {tokens.map((t, idx) => (
                    <div key={t.id} className="flex justify-between border-b border-white/5 py-0.5">
                      <span className="text-slate-300 font-bold">{t.cleanText}:</span>
                      <span className="text-cyan-300 font-mono text-[10px]">
                        [{attentionData.heads[0]?.K[idx]?.map(v => v.toFixed(2)).join(', ') || '0.00'}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-armor-900/60 border border-red-500/30">
                <span className="font-orbitron text-xs font-bold text-red-400 block mb-2">VALUE (V) TENSORS</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {tokens.map((t, idx) => (
                    <div key={t.id} className="flex justify-between border-b border-white/5 py-0.5">
                      <span className="text-slate-300 font-bold">{t.cleanText}:</span>
                      <span className="text-red-300 font-mono text-[10px]">
                        [{attentionData.heads[0]?.V[idx]?.map(v => v.toFixed(2)).join(', ') || '0.00'}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </HudFrame>
      )}

      {/* Tab 4: Formula Derivation */}
      {activeTab === "math" && (
        <HudFrame
          title="SCALED DOT-PRODUCT ATTENTION DERIVATION"
          subtitle="MATHEMATICAL FOUNDATION OF TRANSFORMER REASONING"
          badge="VASWANI ET AL."
          variant="gold"
        >
          <div className="space-y-4 font-mono text-sm">
            <div className="p-5 rounded-xl bg-[#090b14] border border-amber-500/40 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">
                CORE ATTENTION GOVERNING EQUATION
              </span>
              <div className="text-base sm:text-lg text-amber-300 font-bold py-2">
                Attention(Q, K, V) = softmax( (Q · K^T) / √d_k + M ) · V
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-armor-900 border border-white/10">
                <span className="font-bold text-amber-300 block mb-1">1. Dot Product (Q · K^T)</span>
                <p className="text-slate-400">
                  Calculates compatibility score between query token and candidate token across representation space.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-armor-900 border border-white/10">
                <span className="font-bold text-cyan-300 block mb-1">2. Scaling Factor (1 / √d_k)</span>
                <p className="text-slate-400">
                  Prevents dot products from growing large in high dimensions, preventing vanishing softmax gradients.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-armor-900 border border-white/10">
                <span className="font-bold text-red-300 block mb-1">3. Softmax & Value Pooling</span>
                <p className="text-slate-400">
                  Normalizes scores into probability weights that scale and combine Value payload vectors V.
                </p>
              </div>
            </div>
          </div>
        </HudFrame>
      )}
    </div>
  );
};
