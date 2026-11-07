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
  const [activeLayer, setActiveLayer] = useState<'headline' | 'secondary'>('headline');
  const [typoState, setTypoState] = useState<TypographicState>(DEFAULT_STATE);
  const [customFonts, setCustomFonts] = useState<FontDefinition[]>([]);
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

    // 1. Headline Layer Randomization
    const randomHeadlineFont = allAvailableFonts[Math.floor(Math.random() * allAvailableFonts.length)];
    const randomHeadlineWeight = randomHeadlineFont.weights[Math.floor(Math.random() * randomHeadlineFont.weights.length)];
    const randomHeadlineSize = Math.floor(Math.random() * 26) + 38; // 38px to 64px
    const randomHeadlineTracking = Number(((Math.random() * 0.24) - 0.05).toFixed(2));
    const randomHeadlineLeading = Number(((Math.random() * 0.35) + 0.85).toFixed(2));
    const alignments: Array<TypographicState['textAlign']> = ['left', 'center', 'right', 'justify'];
    const randomAlign = alignments[Math.floor(Math.random() * alignments.length)];
    const transforms: Array<TypographicState['textTransform']> = ['uppercase', 'none', 'capitalize'];
    const randomTransform = transforms[Math.floor(Math.random() * transforms.length)];

    const headlinePhrases = [
      "DIE NEUE GRAPHIK",
      "RASTER SYSTEME",
      "OPTICAL CADENCE",
      "KINETIC VECTORS",
      "GEOMETRIC TENSION",
      "FORM FOLLOWS FORM",
      "ARCHITECTURAL ORDER",
      "SYSTEM CALIBRATION",
      "THE SUBLIME GEOMETRY",
      "AVANT-GARDE HYPER-TYPE",
      "PRESSURE // VELOCITY",
      "RADAR TELEMETRY 11",
      "CONCRETE CONSTRUCT",
      "TYPOGRAPHIC DIALOGUE",
      "HAIRLINE BRACKETS",
      "SYNAPTIC EMULSION"
    ];
    const randomHeadlineText = headlinePhrases[Math.floor(Math.random() * headlinePhrases.length)];

    // 2. Secondary Pairing Layer Randomization (Ensure distinct complementary font!)
    const eligibleSecondaryFonts = allAvailableFonts.filter(f => f.cssFamily !== randomHeadlineFont.cssFamily);
    const randomSecondaryFont = eligibleSecondaryFonts.length > 0
      ? eligibleSecondaryFonts[Math.floor(Math.random() * eligibleSecondaryFonts.length)]
      : allAvailableFonts[0];

    const bodyWeights = randomSecondaryFont.weights.filter(w => w <= 600);
    const randomSecondaryWeight = bodyWeights.length > 0
      ? bodyWeights[Math.floor(Math.random() * bodyWeights.length)]
      : randomSecondaryFont.weights[0];

    const randomSecondarySize = Math.floor(Math.random() * 5) + 11; // 11px to 15px
    const randomSecondaryTracking = Number(((Math.random() * 0.08) + 0.02).toFixed(2)); // 0.02 to 0.10em

    const secondaryPhrases = [
      "1957 // ZÜRICH — Internationale Zeitschrift für Graphische Kunst und verwandte Gebiete.",
      "An orthogonal grid brings imagery, type, and color into intellectual and optical unity.",
      "A rigorous dialogue between Enlightenment Didone hairline brackets and grotesque vectors.",
      "Vertical compression creates undeniable spatial dominance across massive architectural poster canvases.",
      "Telemetry coordinates locked at 1420.405 MHz. Optical vectors stabilized across all axes.",
      "Order is the prerequisite of optical clarity across architectural layouts and print media.",
      "Digital letterforms are mathematical Bézier curves undergoing continuous kinetic transformation.",
      "Harmonic modular scales produce consistent typographic progressions across infinite viewport densities.",
      "Allgemeine Gewerbeschule Basel // Kunstgewerbeschule Zürich Typographic Specimen Engine.",
      "Josef Müller-Brockmann & Armin Hofmann: The Swiss Grid and Modernist Poster Art."
    ];
    const randomSecondaryText = secondaryPhrases[Math.floor(Math.random() * secondaryPhrases.length)];

    // 3. Harmonized Palette (Headline text, Background, Secondary text)
    const palettes = [
      { text: '#F4F5F7', bg: '#070809', sub: '#00FF66' },
      { text: '#00FF66', bg: '#070809', sub: '#F4F5F7' },
      { text: '#FFFFFF', bg: '#10141D', sub: '#00E5FF' },
      { text: '#FFB800', bg: '#08080A', sub: '#00FF66' },
      { text: '#070809', bg: '#00FF66', sub: '#111317' },
      { text: '#070809', bg: '#F4F5F7', sub: '#262D38' },
      { text: '#F4F5F7', bg: '#0A0E17', sub: '#FFB800' },
      { text: '#FFFFFF', bg: '#18121E', sub: '#FF3366' },
      { text: '#00FF66', bg: '#111915', sub: '#00E5FF' },
    ];
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomSkew = Math.random() > 0.7 ? Math.floor((Math.random() * 16) - 8) : 0;
    const watermarks = ["57", "11", "№", "§", "R", "SPQR", "M", "AXIOM"];
    const randomWatermark = watermarks[Math.floor(Math.random() * watermarks.length)];

    // 4. Random Texture & Modifiers
    const allTextures: Array<TypographicState['backgroundTexture']> = [
      'photostat', 'darkroom', 'swiss-grid', 'macro-ink', 'risograph', 
      'crumpled-paper', 'marbled-ink', 'distressed-xerox', 'glitch-matrix', 
      'woodcut-hatch', 'thermal-fax', 'halftone-dots', 'cyber-scanline', 'blueprint-grid', 'film-grain'
    ];
    const randomTexture = allTextures[Math.floor(Math.random() * allTextures.length)];
    const blendModes: Array<TypographicState['textureBlendMode']> = ['normal', 'screen', 'overlay', 'hard-light', 'difference'];
    const randomBlend = blendModes[Math.floor(Math.random() * blendModes.length)];
    const tints: Array<TypographicState['textureTint']> = ['none', 'green', 'amber', 'cyan', 'crimson', 'monochrome'];
    const randomTint = tints[Math.floor(Math.random() * tints.length)];
    const frames: Array<TypographicState['canvasFrame']> = ['poster', 'square', 'editorial', 'ribbon'];
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];

    // 5. Graphic Plates library for image layer
    const plates = [
      '/images/crumpled-paper-plate.jpg',
      '/images/photostat-grain-plate.jpg',
      '/images/risograph-halftone-mesh.jpg',
      '/images/swiss-grid-abstract-geometry.jpg',
      '/images/type-lab-darkroom-texture.jpg',
      '/images/macro-ink-interference-plate.jpg',
    ];
    const randomPlate = plates[Math.floor(Math.random() * plates.length)];
    const randomShowImage = Math.random() > 0.65;
    const placements: Array<TypographicState['imagePlacement']> = ['between', 'background', 'below'];
    const randomPlacement = placements[Math.floor(Math.random() * placements.length)];

    setTypoState(prev => ({
      ...prev,
      // Headline Layer
      text: randomHeadlineText,
      fontFamily: randomHeadlineFont.cssFamily,
      fontWeight: randomHeadlineWeight,
      fontSize: randomHeadlineSize,
      letterSpacing: randomHeadlineTracking,
      lineHeight: randomHeadlineLeading,
      textAlign: randomAlign,
      textTransform: randomTransform,
      textColor: randomPalette.text,
      backgroundColor: randomPalette.bg,
      skew: randomSkew,
      canvasFrame: randomFrame,
      // Secondary Pairing Layer
      showSubText: true,
      subText: randomSecondaryText,
      subFontFamily: randomSecondaryFont.cssFamily,
      subFontWeight: randomSecondaryWeight,
      subFontSize: randomSecondarySize,
      subLetterSpacing: randomSecondaryTracking,
      subTextColor: randomPalette.sub,
      // Ambient Watermark
      watermarkText: randomWatermark,
      // Graphic Texture & Modifiers
      backgroundTexture: randomTexture,
      textureOpacity: Number((Math.random() * 0.35 + 0.45).toFixed(2)),
      textureBlendMode: randomBlend,
      textureScale: [75, 100, 125, 150, 175][Math.floor(Math.random() * 5)],
      textureContrast: [90, 110, 130, 160][Math.floor(Math.random() * 4)],
      textureBrightness: [95, 105, 115][Math.floor(Math.random() * 3)],
      textureBlur: [0, 0, 1][Math.floor(Math.random() * 3)],
      textureInvert: Math.random() > 0.75,
      textureTint: randomTint,
      // Graphic Image Plate Layer
      showImageLayer: randomShowImage,
      imageUrl: randomPlate,
      imagePlacement: randomPlacement,
      imageOpacity: Number((Math.random() * 0.3 + 0.7).toFixed(2)),
      imageBlendMode: 'normal',
      imageHeight: Math.floor(Math.random() * 100) + 160,
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
    <div className="h-screen h-[100dvh] w-full bg-[#070809] text-[#F4F5F7] flex flex-col font-mono-code selection:bg-[#00FF66] selection:text-[#070809] overflow-hidden">
      
      {/* Universal Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onRandomize={handleRandomize}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content View Switcher — 100vh full-bleed studio */}
      <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        {activeTab === 'playground' && (
          <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            
            {/* Visual Canvas Artboard (7-8 cols on large screens, scrollable viewport) */}
            <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0 overflow-y-auto flex flex-col justify-start bg-[#070809] border-r border-[#1E232E]">
              <TypographicCanvas
                state={typoState}
                onChangeText={(text) => handleUpdateState({ text })}
                onChangeSubText={(subText) => handleUpdateState({ subText })}
                onChangeTexture={(bg) => handleUpdateState({ backgroundTexture: bg })}
                canvasRef={canvasRef}
                onAutoFitSize={handleAutoFitSize}
                activeLayer={activeLayer}
                onSelectLayer={setActiveLayer}
              />
            </div>

            {/* Interactive Control Dock (4-5 cols on large screens, fixed studio height) */}
            <div className="lg:col-span-5 xl:col-span-4 h-full min-h-0 flex flex-col overflow-hidden bg-[#111317]">
              <ControlDock
                state={typoState}
                onChange={handleUpdateState}
                onReset={handleReset}
                onCopyCSS={handleCopyCSS}
                onAutoFitSize={handleAutoFitSize}
                customFonts={customFonts}
                onUploadCustomFont={handleUploadCustomFont}
                activeLayer={activeLayer}
                onSelectLayer={setActiveLayer}
              />
            </div>

          </div>
        )}

        {activeTab === 'specimens' && (
          <div className="flex-1 min-h-0 overflow-y-auto w-full">
            <SpecimensPage onLoadIntoPlayground={handleLoadIntoPlayground} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex-1 min-h-0 overflow-y-auto w-full">
            <AboutPage />
          </div>
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
