import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { PipelineStepper } from './components/PipelineStepper';
import { Stage1Tokenization } from './components/stages/Stage1Tokenization';
import { Stage2Embedding } from './components/stages/Stage2Embedding';
import { Stage3Attention } from './components/stages/Stage3Attention';
import { Stage4Prediction } from './components/stages/Stage4Prediction';
import { TerminalLogs } from './components/TerminalLogs';
import { TheoryModal } from './components/TheoryModal';
import { PRESETS } from './data/presets';
import { 
  processTokens, 
  computeMultiHeadAttention, 
  predictNextToken 
} from './utils/llmCalculations';
import { soundManager } from './audio/soundManager';

export function App() {
  // Global State
  const [promptText, setPromptText] = useState(PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [currentStage, setCurrentStage] = useState(1);
  const [viewMode, setViewMode] = useState("3D");
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Hyperparameters
  const [temperature, setTemperature] = useState(0.7);
  const [causalMask, setCausalMask] = useState(true);
  const [threshold, setThreshold] = useState(0.08);

  // Mathematical outputs
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [attentionData, setAttentionData] = useState({ heads: [], averageMatrix: [], topConnections: [] });
  const [prediction, setPrediction] = useState({ topToken: null, candidates: [], entropy: 0 });
  const [logs, setLogs] = useState([]);

  // Telemetry Logger
  const addLog = useCallback((level, message) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { timestamp: time, level, message }]);
  }, []);

  // Compute Full LLM Pipeline Tensors
  const runPipelineComputation = useCallback((inputText, tempVal = temperature, maskVal = causalMask) => {
    addLog('info', `Initializing Mark-85 Neural Engine with prompt: "${inputText.slice(0, 32)}..."`);

    // 1. Tokenize & Positional Embedding
    const computedTokens = processTokens(inputText);
    setTokens(computedTokens);
    setSelectedToken(computedTokens[0] || null);
    addLog('success', `Discrete Tokenization complete: ${computedTokens.length} subword tokens generated.`);

    // 2. High-Dimensional Vector Embeddings
    addLog('info', `Computed 16-D continuous embeddings and sinusoidal positional vectors.`);

    // 3. Multi-Head Scaled Dot-Product Attention
    const computedAttention = computeMultiHeadAttention(computedTokens, maskVal, 4);
    setAttentionData(computedAttention);
    addLog('success', `Multi-Head Attention calculated across 4 heads (Causal Mask: ${maskVal ? 'ON' : 'OFF'}).`);

    // 4. Softmax & Next Token Prediction
    const computedPrediction = predictNextToken(computedTokens, tempVal);
    setPrediction(computedPrediction);
    addLog('success', `Softmax normalization converged: Top predicted candidate is "${computedPrediction.topToken?.token}" (${((computedPrediction.topToken?.probability || 0) * 100).toFixed(1)}%).`);

    return { computedTokens, computedAttention, computedPrediction };
  }, [temperature, causalMask, addLog]);

  // Initial calculation on mount
  useEffect(() => {
    addLog('info', 'STARK INDUSTRIES J.A.R.V.I.S. LLM PIPELINE BOOT SEQUENCE INITIALIZED');
    runPipelineComputation(promptText);
  }, []);

  // Execute Pipeline Animation Sequence
  const handleExecutePipeline = () => {
    setIsExecuting(true);
    addLog('warn', '>>> INITIATING FULL TACTICAL PIPELINE PASS <<<');

    setTimeout(() => {
      runPipelineComputation(promptText);
      setIsExecuting(false);
      addLog('success', '=== PIPELINE EXECUTION COMPLETED WITH NOMINAL PARAMETERS ===');
    }, 450);
  };

  // Reset Pipeline to Defaults
  const handleResetPipeline = () => {
    const defaultPreset = PRESETS[0];
    setPromptText(defaultPreset.text);
    setSelectedPresetId(defaultPreset.id);
    setCurrentStage(1);
    setTemperature(0.7);
    setCausalMask(true);
    setThreshold(0.08);
    runPipelineComputation(defaultPreset.text, 0.7, true);
    addLog('warn', 'Pipeline telemetry reset to Stark benchmark defaults.');
  };

  // Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setPromptText(preset.text);
    addLog('info', `Loaded tactical preset: "${preset.title}"`);
    setTimeout(() => {
      runPipelineComputation(preset.text);
    }, 50);
  };

  // Append Predicted Candidate (Autoregressive Generation)
  const handleAppendCandidate = (candidateToken) => {
    const separator = promptText.endsWith(' ') || promptText.endsWith('"') ? '' : ' ';
    const updatedText = `${promptText}${separator}${candidateToken}`;
    setPromptText(updatedText);
    addLog('info', `Autoregressive step: Appended candidate "${candidateToken}" to prompt context.`);

    setTimeout(() => {
      runPipelineComputation(updatedText);
      setCurrentStage(5);
    }, 50);
  };

  // Live Prompt Editing
  const handleChangePrompt = (newText) => {
    setPromptText(newText);
    setSelectedPresetId(null);
  };

  // Stage Stepping
  const handleNextStage = () => {
    if (currentStage < 5) setCurrentStage(s => s + 1);
  };

  const handlePrevStage = () => {
    if (currentStage > 1) setCurrentStage(s => s - 1);
  };

  return (
    <div className="min-h-screen bg-[#050609] text-slate-100 flex flex-col scanline-bg">
      {/* J.A.R.V.I.S. Tactical Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === "3D" ? "2D" : "3D")}
        onOpenTheory={() => setIsTheoryOpen(true)}
        isExecuting={isExecuting}
        currentStage={currentStage}
      />

      {/* Main Tactical Display */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Preset Selector */}
        <PresetSelector
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* 5-Stage Stepper Navigation */}
        <PipelineStepper
          currentStage={currentStage}
          onSelectStage={(stageId) => setCurrentStage(stageId)}
          onNextStage={handleNextStage}
          onPrevStage={handlePrevStage}
          onExecutePipeline={handleExecutePipeline}
          onResetPipeline={handleResetPipeline}
          isExecuting={isExecuting}
        />

        {/* Active Stage View */}
        <div className="pt-2">
          {currentStage === 1 && (
            <Stage1Tokenization
              promptText={promptText}
              onChangePrompt={handleChangePrompt}
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              onExecute={() => runPipelineComputation(promptText)}
            />
          )}

          {currentStage === 2 && (
            <Stage2Embedding
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(v => v === "3D" ? "2D" : "3D")}
            />
          )}

          {currentStage === 3 && (
            <Stage2Embedding
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(v => v === "3D" ? "2D" : "3D")}
            />
          )}

          {currentStage === 4 && (
            <Stage3Attention
              tokens={tokens}
              attentionData={attentionData}
              causalMask={causalMask}
              onToggleCausalMask={() => {
                const nextMask = !causalMask;
                setCausalMask(nextMask);
                runPipelineComputation(promptText, temperature, nextMask);
              }}
              threshold={threshold}
              onChangeThreshold={setThreshold}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
            />
          )}

          {currentStage === 5 && (
            <Stage4Prediction
              prediction={prediction}
              temperature={temperature}
              onChangeTemperature={(newTemp) => {
                setTemperature(newTemp);
                setPrediction(predictNextToken(tokens, newTemp));
              }}
              onAppendCandidate={handleAppendCandidate}
              isExecuting={isExecuting}
            />
          )}
        </div>

        {/* Telemetry Console */}
        <div className="pt-4">
          <TerminalLogs
            logs={logs}
            onClearLogs={() => setLogs([])}
          />
        </div>
      </main>

      {/* Theory of LLMs Holographic Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* Tactical Footer */}
      <footer className="border-t border-amber-500/20 bg-[#07080d] py-4 px-4 text-center font-mono text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
          <span>STARK INDUSTRIES TACTICAL NEURAL SUITE</span>
          <span className="hidden sm:inline">•</span>
          <span>MARK-85 ARCHITECTURE</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-amber-400">J.A.R.V.I.S. VERIFIED</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
