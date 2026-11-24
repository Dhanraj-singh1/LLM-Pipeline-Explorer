import React from 'react';
import { soundManager } from '../audio/soundManager';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  RotateCcw,
  Binary,
  Compass,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const PIPELINE_STAGES = [
  {
    id: 1,
    title: "Stage 01",
    name: "Discrete Tokenization",
    subtitle: "BPE Subword Partitioning",
    icon: Binary,
    bgActive: "bg-red-950/80 border-red-500 text-red-300 shadow-stark-red",
    indicatorColor: "bg-red-500",
  },
  {
    id: 2,
    title: "Stage 02",
    name: "Positional Encoding",
    subtitle: "Sinusoidal Sequence Vectors",
    icon: Compass,
    bgActive: "bg-amber-950/80 border-amber-500 text-amber-300 shadow-stark-gold",
    indicatorColor: "bg-amber-400",
  },
  {
    id: 3,
    title: "Stage 03",
    name: "Vector Embeddings",
    subtitle: "High-Dimensional Spatial Topology",
    icon: Layers,
    bgActive: "bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-arc",
    indicatorColor: "bg-cyan-400",
  },
  {
    id: 4,
    title: "Stage 04",
    name: "Multi-Head Attention",
    subtitle: "Scaled Dot-Product QKV Matrix",
    icon: Cpu,
    bgActive: "bg-purple-950/80 border-purple-500 text-purple-300",
    indicatorColor: "bg-purple-400",
  },
  {
    id: 5,
    title: "Stage 05",
    name: "Next-Token Decoding",
    subtitle: "Softmax Probability Normalization",
    icon: Sparkles,
    bgActive: "bg-rose-950/80 border-rose-500 text-rose-300",
    indicatorColor: "bg-rose-400",
  }
];

/**
 * Iron Man Tactical Pipeline Stepper
 * Lets Tony Stark or the user navigate through all 5 pipeline phases or execute the full flow.
 */
export const PipelineStepper = ({
  currentStage,
  onSelectStage,
  onNextStage,
  onPrevStage,
  onExecutePipeline,
  onResetPipeline,
  isExecuting
}) => {
  return (
    <div className="space-y-4">
      {/* Top Controls: Nav arrows + Repulsor Execute Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playStageTransition();
              onPrevStage();
            }}
            disabled={currentStage <= 1 || isExecuting}
            className="p-2 rounded-lg border border-armor-700 bg-armor-850 text-slate-300 hover:text-amber-300 hover:border-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Previous Pipeline Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playStageTransition();
              onNextStage();
            }}
            disabled={currentStage >= 5 || isExecuting}
            className="p-2 rounded-lg border border-armor-700 bg-armor-850 text-slate-300 hover:text-amber-300 hover:border-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Next Pipeline Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onResetPipeline();
            }}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-armor-700 bg-armor-850 hover:bg-armor-800 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Reset parameters to benchmark defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>

        {/* Repulsor Execute Trigger */}
        <button
          onClick={() => {
            soundManager.playExecute();
            onExecutePipeline();
          }}
          disabled={isExecuting}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-orbitron font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:via-amber-400 hover:to-red-500 text-black shadow-stark-red hover:shadow-stark-gold disabled:opacity-60 cursor-pointer active:scale-95"
        >
          <Play className={`w-4 h-4 fill-black ${isExecuting ? 'animate-spin' : ''}`} />
          <span>{isExecuting ? 'COMPUTING NEURAL TENSORS...' : 'EXECUTE PIPELINE'}</span>
        </button>
      </div>

      {/* 5-Stage Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PIPELINE_STAGES.map((stage) => {
          const isActive = currentStage === stage.id;
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              onClick={() => {
                if (!isExecuting) {
                  soundManager.playStageTransition();
                  onSelectStage(stage.id);
                }
              }}
              className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? `${stage.bgActive} scale-[1.02]`
                  : 'bg-armor-900/70 border-armor-700 text-slate-400 hover:border-amber-500/40 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
                  {stage.title}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
              </div>

              <div>
                <h4 className="font-orbitron font-bold text-xs text-white line-clamp-1">
                  {stage.name}
                </h4>
                <p className="font-mono text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                  {stage.subtitle}
                </p>
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${stage.indicatorColor} ${isActive ? 'w-full' : currentStage > stage.id ? 'w-full opacity-60' : 'w-0'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
