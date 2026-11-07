import React, { useState, useEffect, useRef } from 'react';
import type { TypographicState, FontDefinition } from './types';
import { SPECIMEN_PRESETS } from './data/presets';
import { AVAILABLE_FONTS } from './data/fonts';
import { Navbar } from './components/Navbar';
import { TypographicCanvas } from './components/playground/TypographicCanvas';
import { ControlDock } from './components/playground/ControlDock';
import { SpecimensPage } from './components/specimens/SpecimensPage';
import { AboutPage } from './components/about/AboutPage';
import { ExportModal } from './components/common/ExportModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';

const DEFAULT_STATE: TypographicState = SPECIMEN_PRESETS[0].state;

export const App: React.FC = () => {
  const getInitialTab = (): 'playground' | 'specimens' | 'about' => {
    if (typeof window === 'undefined') return 'playground';
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'specimens' || tab === 'about' || tab === 'playground') return tab;
    const hash = window.location.hash.replace('#', '');
    if (hash === 'specimens' || hash === 'about') return hash as any;
    return 'playground';
  };

  const [activeTab, setActiveTab] = useState<'playground' | 'specimens' | 'about'>(getInitialTab);
  const [typoState, setTypoState] = useState<TypographicState>(DEFAULT_STATE);
  const [customFonts, setCustomFonts] = useState<FontDefinition[]>([]);
  const [backgroundTexture, setBackgroundTexture] = useState<'none' | 'darkroom' | 'swiss-grid' | 'macro-ink'>('none');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTab = (tab: 'playground' | 'specimens' | 'about') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea or contentEditable
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRandomize();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        handleInvert();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setTypoState(prev => ({ ...prev, showGrid: !prev.showGrid }));
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setTypoState(prev => ({ ...prev, canvasFrame: 'poster' }));
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setTypoState(prev => ({ ...prev, canvasFrame: 'square' }));
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateState = (updates: Partial<TypographicState>) => {
    setTypoState(prev => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setTypoState(DEFAULT_STATE);
    setBackgroundTexture('none');
  };

  const handleInvert = () => {
    setTypoState(prev => ({
      ...prev,
      textColor: prev.backgroundColor,
      backgroundColor: prev.textColor,
    }));
  };

  // Smart Auto-Fit Size algorithm
  const handleAutoFitSize = () => {
    const lines = typoState.text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return;

    // Find the longest line by character count
    const maxLineLength = Math.max(...lines.map(l => l.length));
    
    // In a 480px available inner width:
    // Character width is roughly 0.58 * fontSize
    // So targetSize = 460 / (maxLineLength * 0.58)
    const availableWidth = 460;
    const availableHeight = 440;
    
    const sizeBasedOnWidth = Math.floor(availableWidth / (maxLineLength * 0.58));
    const sizeBasedOnHeight = Math.floor(availableHeight / (lines.length * (typoState.lineHeight || 1.0) * 1.2));
    
    const calculatedSize = Math.max(16, Math.min(sizeBasedOnWidth, sizeBasedOnHeight, 120));

    setTypoState(prev => ({
      ...prev,
      fontSize: calculatedSize
    }));
  };

  const handleRandomize = () => {
    const allAvailableFonts = [...AVAILABLE_FONTS, ...customFonts];
    const randomFont = allAvailableFonts[Math.floor(Math.random() * allAvailableFonts.length)];
    const randomWeight = randomFont.weights[Math.floor(Math.random() * randomFont.weights.length)];
    const randomSize = Math.floor(Math.random() * 40) + 36;
    const randomTracking = Number(((Math.random() * 0.3) - 0.04).toFixed(2));
    const randomLeading = Number(((Math.random() * 0.4) + 0.9).toFixed(2));
    
    const palettes = [
      { text: '#00FF66', bg: '#070809' },
      { text: '#F4F5F7', bg: '#070809' },
      { text: '#070809', bg: '#00FF66' },
      { text: '#FFFFFF', bg: '#10141D' },
      { text: '#FFB800', bg: '#08080A' },
      { text: '#070809', bg: '#F4F5F7' },
    ];
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomSkew = Math.random() > 0.7 ? Math.floor((Math.random() * 12) - 6) : 0;

    setTypoState(prev => ({
      ...prev,
      fontFamily: randomFont.cssFamily,
      fontWeight: randomWeight,
      fontSize: randomSize,
      letterSpacing: randomTracking,
      lineHeight: randomLeading,
      textColor: randomPalette.text,
      backgroundColor: randomPalette.bg,
      skew: randomSkew,
    }));
  };

  const handleLoadIntoPlayground = (specimenState: Partial<TypographicState>) => {
    setTypoState(prev => ({ ...prev, ...specimenState }));
    handleSelectTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadCustomFont = (newFont: FontDefinition) => {
    setCustomFonts(prev => [newFont, ...prev]);
  };

  const handleCopyCSS = () => {
    const css = `/* TYPE//LAB 11 CSS */
font-family: ${typoState.fontFamily};
font-size: ${typoState.fontSize}px;
font-weight: ${typoState.fontWeight};
letter-spacing: ${typoState.letterSpacing}em;
line-height: ${typoState.lineHeight};
color: ${typoState.textColor};
background-color: ${typoState.backgroundColor};
${typoState.strokeWidth > 0 ? `-webkit-text-stroke: ${typoState.strokeWidth}px ${typoState.strokeColor};` : ''}
${typoState.isVertical ? `writing-mode: vertical-rl;` : ''}`;
    navigator.clipboard.writeText(css);
  };

  return (
    <div className="min-h-screen bg-[#070809] text-[#F4F5F7] flex flex-col font-mono-code selection:bg-[#00FF66] selection:text-[#070809]">
      
      {/* Universal Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onRandomize={handleRandomize}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'playground' && (
          <div className="flex-1 max-w-[1680px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 grid grid-cols-1 lg:grid-cols-12 items-start gap-4">
            
            {/* Visual Canvas Artboard (7 cols on large screens) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center bg-[#070809] border border-[#1E232E]">
              <TypographicCanvas
                state={typoState}
                onChangeText={(text) => handleUpdateState({ text })}
                onChangeSubText={(subText) => handleUpdateState({ subText })}
                backgroundTexture={backgroundTexture}
                canvasRef={canvasRef}
                onAutoFitSize={handleAutoFitSize}
              />
            </div>

            {/* Interactive Control Dock (5 cols on large screens) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col border border-[#1E232E]">
              <ControlDock
                state={typoState}
                onChange={handleUpdateState}
                onReset={handleReset}
                backgroundTexture={backgroundTexture}
                onChangeBackgroundTexture={setBackgroundTexture}
                onCopyCSS={handleCopyCSS}
                onAutoFitSize={handleAutoFitSize}
                customFonts={customFonts}
                onUploadCustomFont={handleUploadCustomFont}
              />
            </div>

          </div>
        )}

        {activeTab === 'specimens' && (
          <SpecimensPage onLoadIntoPlayground={handleLoadIntoPlayground} />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Export Modal Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        state={typoState}
        canvasRef={canvasRef}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

    </div>
  );
};

export default App;
