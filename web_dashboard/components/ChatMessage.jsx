import React, { useState, useEffect } from 'react';

export default function ChatMessage({ role, message, thoughts, isStreaming, onCopyToClipboard }) {
  const isUser = role === 'user';
  const [displayedText, setDisplayedText] = useState(isStreaming ? '' : message);
  const [copied, setCopied] = useState(false);

  // Typewriter streaming simulation for high fidelity visual presentation
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(message);
      return;
    }

    setDisplayedText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText((prev) => prev + message.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Fast typing pace

    return () => clearInterval(interval);
  }, [message, isStreaming]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      if (onCopyToClipboard) onCopyToClipboard(message);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
      {isUser ? (
        /* ==========================================
           USER MESSAGE BUBBLE
           ========================================== */
        <div className="max-w-[70%] space-y-1.5">
          {/* User Header */}
          <div className="flex items-center gap-2 justify-end pr-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              You
            </span>
            <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
          </div>

          <div className="bg-indigo-600 border border-indigo-500/20 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayedText}</p>
          </div>
        </div>
      ) : (
        /* ==========================================
           TWIN ASSISTANT MESSAGE BUBBLE (Streamable)
           ========================================== */
        <div className="max-w-[75%] space-y-2">
          {/* Assistant Header */}
          <div className="flex items-center gap-2 pl-1">
            <span className="material-symbols-outlined text-indigo-400 text-sm">smart_toy</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              SHADOWMIND TWIN
            </span>
            {isStreaming && (
              <span className="text-[9px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
                Streaming
              </span>
            )}
          </div>

          {/* Assistant Main Container */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-md space-y-3 relative group">
            
            {/* Expandable ReAct thoughts trail */}
            {thoughts && (
              <details className="group/details border border-slate-800 bg-black/30 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-3 cursor-pointer select-none text-xs font-bold text-indigo-400 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-indigo-400">auto_awesome</span>
                    Cognitive Trail (ReAct Thoughts)
                  </div>
                  <span className="material-symbols-outlined text-[16px] group-open/details:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="p-3 border-t border-slate-800 bg-black/40 font-mono text-[11px] leading-normal text-slate-400 max-h-48 overflow-y-auto whitespace-pre-line">
                  {thoughts}
                </div>
              </details>
            )}

            {/* Message Body & Cursor */}
            <div className="relative">
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-medium inline">
                {displayedText}
              </p>
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-1 translate-y-0.5 animate-[blink_0.8s_infinite]"></span>
              )}
            </div>

            {/* Message Actions Row (Copy, Share, Refine) */}
            <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 mt-3">
              <div className="flex gap-2">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  title="Copy response"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'done' : 'content_copy'}
                  </span>
                  {copied ? 'Copied' : 'Copy'}
                </button>

                {/* Simulated Speak Text Button */}
                <button
                  title="Speak Response"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">volume_up</span>
                  Speak
                </button>
              </div>

              {/* Status Code / Confidence Indicator */}
              <span className="text-[9px] font-black tracking-wider text-slate-600 uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                Status: Verified
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
