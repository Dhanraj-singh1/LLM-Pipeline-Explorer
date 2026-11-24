import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';
import { Terminal, Copy, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';

/**
 * Stark Industries Tactical Telemetry Console
 * Displays live pipeline events, execution logs, mathematical checkpoints, and timestamps.
 */
export const TerminalLogs = ({ logs, onClearLogs }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    soundManager.playClick();
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-armor-700 bg-[#07080d]/95 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-armor-700/80 bg-armor-900/60 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-300">STARK TELEMETRY CONSOLE</span>
          <span className="text-[10px] text-slate-500">// MARK-85 EVENT STREAM</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-armor-800 text-slate-400 hover:text-white transition-colors"
            title="Copy Logs to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onClearLogs();
            }}
            className="p-1.5 rounded hover:bg-armor-800 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded hover:bg-armor-800 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? "Collapse Console" : "Expand Console"}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="p-3 font-mono text-[11px] leading-relaxed max-h-44 overflow-y-auto space-y-1 bg-[#05060a]"
        >
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">No events recorded. Initialize pipeline execution above.</div>
          ) : (
            logs.map((log, index) => {
              const levelColors = {
                info: "text-cyan-400",
                success: "text-emerald-400",
                warn: "text-amber-400",
                error: "text-red-400"
              };
              return (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                  <span className={`font-bold uppercase select-none ${levelColors[log.level] || 'text-slate-400'}`}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
