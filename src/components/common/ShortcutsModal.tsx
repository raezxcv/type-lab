import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'R', desc: 'Randomize typographic parameters & pairings' },
    { key: 'I', desc: 'Invert canvas foreground and background colors' },
    { key: 'G', desc: 'Toggle modular and baseline inspection grid' },
    { key: 'P', desc: 'Switch canvas to Swiss DIN A Poster frame' },
    { key: 'S', desc: 'Switch canvas to 1:1 Square Artboard frame' },
    { key: 'E', desc: 'Open Export dialog (High-Res PNG, SVG, CSS)' },
    { key: 'Esc', desc: 'Reset all active parameters to lab defaults' },
    { key: '?', desc: 'Toggle this keyboard shortcuts telemetry cheat-sheet' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070809]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#0D0F14] border border-[#22262E] shadow-2xl p-6 sm:p-8 font-mono-code text-xs text-[#F4F5F7]"
        role="dialog"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#22262E]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#00FF66]" />
            <h2 id="shortcuts-modal-title" className="text-sm font-bold tracking-wider uppercase text-[#F4F5F7]">
              KEYBOARD TELEMETRY SHORTCUTS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#758091] hover:text-[#F4F5F7] hover:bg-[#1A1F29] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-2.5">
          {shortcuts.map((item) => (
            <div 
              key={item.key}
              className="flex items-center justify-between p-2 bg-[#12151B] border border-[#1E232E]"
            >
              <span className="text-[#9AA2B1]">{item.desc}</span>
              <kbd className="px-2 py-1 bg-[#1A202C] text-[#00FF66] border border-[#2F3A4F] text-[11px] font-bold rounded shadow">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#22262E] flex justify-between items-center text-[11px] text-[#556072]">
          <span>TYPE//LAB 11 ACCESSIBILITY CONFORMANCE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#2B3342] transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
