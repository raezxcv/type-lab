import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  BookOpen, 
  Shuffle, 
  Download, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'playground' | 'specimens' | 'about';
  setActiveTab: (tab: 'playground' | 'specimens' | 'about') => void;
  onRandomize?: () => void;
  onOpenShortcuts: () => void;
  onOpenExport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRandomize,
  onOpenShortcuts,
  onOpenExport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#070809] border-b border-[#22262E] text-sm">
      {/* Top telemetry bar with minimum 12px readable text */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 border-b border-[#1A1E26] text-xs font-mono-code text-[#9AA2B1] bg-[#0A0C10]">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-2 text-[#00FF66] font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
            SYS_ONLINE // ENGINE v2.4
          </span>
          <span className="text-[#3A4250]">|</span>
          <span>COORDINATES: 47.3769° N, 8.5417° E (ZÜRICH)</span>
          <span className="text-[#3A4250]">|</span>
          <span>COLOR_SPACE: DCI-P3 // RGB TELEMETRY</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[#00FF66] font-semibold">CATALOG: 88 DESIGNER FONTS</span>
          <span className="text-[#3A4250]">|</span>
          <span>SPECIMENS: 10 ACTIVE</span>
          <span className="text-[#3A4250]">|</span>
          <span className="text-[#F4F5F7]">
            PRESS <kbd className="px-1.5 py-0.5 bg-[#1F242E] text-[#00FF66] border border-[#2E3544] text-xs rounded">?</kbd> FOR SHORTCUTS
          </span>
        </div>
      </div>

      {/* Main navigation container — Full width consistent */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity with H1 */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('playground')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
              aria-label="TYPE//LAB 11 Home"
            >
              <div className="w-9 h-9 bg-[#00FF66] text-[#070809] flex items-center justify-center font-mono-code font-black text-lg tracking-tighter group-hover:bg-[#F4F5F7] transition-colors">
                T/
              </div>
              <div className="flex flex-col">
                <span className="font-space font-bold tracking-tight text-[#F4F5F7] text-lg leading-none group-hover:text-[#00FF66] transition-colors m-0">
                  TYPE//LAB <span className="text-[#00FF66] text-xs font-mono-code align-top">11</span>
                </span>
                <span className="text-xs font-mono-code text-[#A1A1AA] tracking-wider uppercase mt-1">
                  Digital Typographic Studio
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-2" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-mono-code tracking-wider uppercase transition-all border ${
                activeTab === 'playground'
                  ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                  : 'text-[#C2CAD8] hover:text-[#F4F5F7] hover:bg-[#111317] border-transparent'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>01 // PLAYGROUND</span>
            </button>

            <button
              onClick={() => setActiveTab('specimens')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-mono-code tracking-wider uppercase transition-all border ${
                activeTab === 'specimens'
                  ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                  : 'text-[#C2CAD8] hover:text-[#F4F5F7] hover:bg-[#111317] border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>02 // SPECIMENS</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-mono-code tracking-wider uppercase transition-all border ${
                activeTab === 'about'
                  ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                  : 'text-[#C2CAD8] hover:text-[#F4F5F7] hover:bg-[#111317] border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>03 // CODEX & ABOUT</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {activeTab === 'playground' && onRandomize && (
              <button
                onClick={onRandomize}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-mono-code text-[#F4F5F7] bg-[#161A22] hover:bg-[#202632] hover:text-[#00FF66] border border-[#262C3A] transition-colors"
                title="Randomize Typographic Parameters (Shortcut: R)"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#00FF66]" />
                <span className="hidden lg:inline">RANDOM</span>
              </button>
            )}

            {activeTab === 'playground' && onOpenExport && (
              <button
                onClick={onOpenExport}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-mono-code font-bold text-[#070809] bg-[#00FF66] hover:bg-[#4DFF95] transition-colors"
                title="Export Composition as PNG or SVG (Shortcut: E)"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT</span>
              </button>
            )}

            <button
              onClick={onOpenShortcuts}
              className="p-2 text-[#9AA2B1] hover:text-[#00FF66] hover:bg-[#161A22] border border-transparent hover:border-[#262C3A] transition-colors"
              aria-label="Keyboard shortcuts"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            {activeTab === 'playground' && onOpenExport && (
              <button
                onClick={onOpenExport}
                className="px-3 py-1.5 text-xs font-mono-code font-bold bg-[#00FF66] text-[#070809]"
              >
                EXPORT
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#9AA2B1] hover:text-[#F4F5F7] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#00FF66]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#22262E] bg-[#0D0F14] px-4 py-4 space-y-2.5">
          <button
            onClick={() => { setActiveTab('playground'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono-code uppercase border ${
              activeTab === 'playground'
                ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                : 'text-[#C2CAD8] border-[#1F242E]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4" /> 01 // PLAYGROUND
            </span>
            <span className="text-xs text-[#9AA2B1]">LIVE TOOL</span>
          </button>

          <button
            onClick={() => { setActiveTab('specimens'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono-code uppercase border ${
              activeTab === 'specimens'
                ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                : 'text-[#C2CAD8] border-[#1F242E]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" /> 02 // SPECIMENS
            </span>
            <span className="text-xs text-[#9AA2B1]">8 ARCHIVES</span>
          </button>

          <button
            onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono-code uppercase border ${
              activeTab === 'about'
                ? 'bg-[#151922] text-[#00FF66] border-[#00FF66]'
                : 'text-[#C2CAD8] border-[#1F242E]'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> 03 // CODEX & ABOUT
            </span>
            <span className="text-xs text-[#9AA2B1]">ANATOMY & MANIFESTO</span>
          </button>

          <div className="pt-2 flex items-center justify-between text-xs font-mono-code text-[#9AA2B1] border-t border-[#1F242E]">
            <button
              onClick={() => { onOpenShortcuts(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-[#00FF66]"
            >
              <HelpCircle className="w-4 h-4" /> KEYBOARD SHORTCUTS
            </button>
            <span>v2.4</span>
          </div>
        </div>
      )}
    </header>
  );
};
