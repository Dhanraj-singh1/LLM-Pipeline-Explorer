import React from 'react';
import { HudFrame } from '../HudFrame';
import { ArcReactor } from '../ArcReactor';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Sliders, Activity, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Stage 05: Softmax & Next-Token Decoding
 * Displays top predicted token with Arc Reactor pulse, Temperature control slider,
 * Shannon Entropy gauge, candidate probability distribution table, and
 * Append Candidate button for recursive autoregressive loop.
 */
export const Stage4Prediction = ({
  prediction,
  temperature,
  onChangeTemperature,
  onAppendCandidate,
  isExecuting
}) => {
  const { topToken, candidates, entropy } = prediction;

  const handleAppend = (candidate) => {
    soundManager.playAppend();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffd700', '#ef4444', '#00f5ff']
    });
    onAppendCandidate(candidate.token);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Token Banner with Stark Arc Reactor Glow */}
      <HudFrame
        title="NEURAL PREDICTION SYNTHESIS"
        subtitle="TOP GENERATED TOKEN CANDIDATE"
        badge="ARGMAX PREDICTION"
        variant="gold"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-armor-900 border border-amber-500/40">
          <div className="flex items-center space-x-4">
            <ArcReactor size="lg" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                HIGHEST PROBABILITY NEXT TOKEN
              </span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-amber-300 tracking-wider">
                  "{topToken?.token}"
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-400 text-black font-mono font-extrabold text-xs shadow-stark-gold">
                  {((topToken?.probability || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400 mt-1">
                Logit Score: +{topToken?.logit?.toFixed(2)} // Token ID: #{topToken?.id}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAppend(topToken)}
            disabled={isExecuting || !topToken}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black shadow-stark-gold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>APPEND TO PROMPT &amp; REGENERATE</span>
          </button>
        </div>
      </HudFrame>

      {/* Temperature & Entropy Telemetry Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Slider */}
        <div className="p-4 rounded-xl bg-armor-900/60 border border-amber-500/30 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase">
              <Sliders className="w-3.5 h-3.5" />
              <span>TEMPERATURE (T) SAMPLING</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-amber-300">
              {temperature.toFixed(2)}
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-400">
            {temperature < 0.4 
              ? 'Low entropy: deterministic, greedy decoding focused on top candidate.' 
              : temperature > 1.2 
              ? 'High entropy: diverse, creative vocabulary distribution.' 
              : 'Balanced: standard calibrated pretraining distribution.'}
          </p>

          <input
            type="range"
            min="0.1"
            max="1.8"
            step="0.05"
            value={temperature}
            onChange={(e) => {
              onChangeTemperature(parseFloat(e.target.value));
            }}
            className="w-full accent-amber-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0.1 (DETERMINISTIC)</span>
            <span>1.0 (CALIBRATED)</span>
            <span>1.8 (CREATIVE)</span>
          </div>
        </div>

        {/* Shannon Entropy Metric */}
        <div className="p-4 rounded-xl bg-armor-900/60 border border-cyan-500/30 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 flex items-center space-x-1.5 uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>SHANNON ENTROPY (H)</span>
            </span>
            <span className="font-mono text-sm font-extrabold text-cyan-300">
              {entropy.toFixed(3)} bits
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-400">
            Measures uncertainty in the token distribution: H = -∑ P(w) log2 P(w).
          </p>

          {/* Gauge bar */}
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (entropy / 3.0) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 BITS (ZERO CONFUSION)</span>
            <span>3+ BITS (HIGH PERPLEXITY)</span>
          </div>
        </div>
      </div>

      {/* Candidate Probability Distribution Table */}
      <HudFrame
        title="VOCABULARY CANDIDATE DISTRIBUTION"
        subtitle="NORMALIZED SOFTMAX PROBABILITIES P(w_i) = exp(z_i / T) / ∑ exp(z_j / T)"
        badge="TOP CANDIDATES"
        variant="cyan"
      >
        <div className="space-y-3">
          {candidates.map((cand, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={cand.token}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTop
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-stark-gold'
                    : 'bg-armor-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-500 w-5">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-sm text-white">
                      "{cand.token}"
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Logit: {cand.logit > 0 ? `+${cand.logit.toFixed(2)}` : cand.logit.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {(cand.probability * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      (Cum: {(cand.cumulativeProb * 100).toFixed(0)}%)
                    </span>
                    <button
                      onClick={() => handleAppend(cand)}
                      className="px-2.5 py-1 rounded bg-armor-800 hover:bg-amber-500 hover:text-black border border-white/10 text-[10px] font-mono font-bold transition-all cursor-pointer"
                    >
                      APPEND
                    </button>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cand.probability * 100}%`,
                      backgroundColor: isTop ? '#ffd700' : '#00f5ff'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </HudFrame>
    </div>
  );
};
