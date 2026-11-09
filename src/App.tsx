import React, { useState, useEffect, useRef } from 'react';
import type { TypographicState, FontDefinition, PosterLayout } from './types';
import { SPECIMEN_PRESETS } from './data/presets';
import { AVAILABLE_FONTS } from './data/fonts';
import { CURATED_PALETTES } from './data/palettes';
import { CURATED_PAIRINGS } from './data/pairings';
import { STUDIO_PLATES } from './data/plates';
import { Navbar } from './components/Navbar';
import { TypographicCanvas } from './components/playground/TypographicCanvas';
import { ControlDock } from './components/playground/ControlDock';
import { SpecimensPage } from './components/specimens/SpecimensPage';
import { AboutPage } from './components/about/AboutPage';
import { ExportModal } from './components/common/ExportModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { Eye, Sliders, Shuffle } from 'lucide-react';

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
  const [mobilePlaygroundView, setMobilePlaygroundView] = useState<'canvas' | 'controls'>('canvas');
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

    // Helper: compute relative luminance from hex color to pick smart blend modes & contrast
    const isLightColor = (hex: string): boolean => {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return false;
      const r = parseInt(clean.slice(0, 2), 16) / 255;
      const g = parseInt(clean.slice(2, 4), 16) / 255;
      const b = parseInt(clean.slice(4, 6), 16) / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum > 0.45;
    };

    // 1. Select a Harmonized Studio Color Palette
    const randomPalette = CURATED_PALETTES[Math.floor(Math.random() * CURATED_PALETTES.length)];
    const isLightBg = isLightColor(randomPalette.backgroundColor);

    // 2. Smart Font Pairing Selection (70% Curated Studio Pairing, 30% Contrasting Category Pairing)
    const useCuratedPairing = Math.random() < 0.7;
    const pickedPairing = CURATED_PAIRINGS[Math.floor(Math.random() * CURATED_PAIRINGS.length)];

    const randomHeadlineFont = allAvailableFonts[Math.floor(Math.random() * allAvailableFonts.length)];
    const contrastingCategoryMap: Record<string, string[]> = {
      serif: ['grotesk', 'monospace'],
      grotesk: ['monospace', 'serif'],
      display: ['monospace', 'grotesk'],
      experimental: ['monospace', 'grotesk'],
      monospace: ['grotesk', 'serif'],
    };
    const targetSubCategories = contrastingCategoryMap[randomHeadlineFont.category] || ['monospace', 'grotesk'];
    const eligibleSecondaryFonts = allAvailableFonts.filter(
      f => f.cssFamily !== randomHeadlineFont.cssFamily && targetSubCategories.includes(f.category)
    );
    const randomSecondaryFont = eligibleSecondaryFonts.length > 0
      ? eligibleSecondaryFonts[Math.floor(Math.random() * eligibleSecondaryFonts.length)]
      : allAvailableFonts[0];

    const headlineFamily = useCuratedPairing ? pickedPairing.headlineFamily : randomHeadlineFont.cssFamily;
    const headlineWeight = useCuratedPairing
      ? pickedPairing.headlineWeight
      : randomHeadlineFont.weights[Math.floor(Math.random() * randomHeadlineFont.weights.length)];
    const headlineTracking = useCuratedPairing
      ? pickedPairing.headlineTracking
      : Number(((Math.random() * 0.14) - 0.03).toFixed(2));

    const subFontFamily = useCuratedPairing ? pickedPairing.bodyFamily : randomSecondaryFont.cssFamily;
    const bodyWeights = randomSecondaryFont.weights.filter(w => w <= 600);
    const subFontWeight = useCuratedPairing
      ? pickedPairing.bodyWeight
      : (bodyWeights.length > 0 ? bodyWeights[Math.floor(Math.random() * bodyWeights.length)] : randomSecondaryFont.weights[0]);
    const subLetterSpacing = useCuratedPairing
      ? pickedPairing.bodyTracking
      : Number(((Math.random() * 0.05) + 0.01).toFixed(2));

    // 3. Select Architectural Poster Layout & Matching Alignment
    const layouts: PosterLayout[] = [
      'classic-stack', 'swiss-split', 'editorial-magazine', 'brutalist-frame',
      'center-monolith', 'diagonal-construct', 'index-catalog', 'kinetic-banner'
    ];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const randomAlign: TypographicState['textAlign'] =
      randomLayout === 'center-monolith' ? 'center' :
      (randomLayout === 'swiss-split' || randomLayout === 'index-catalog' || randomLayout === 'brutalist-frame') ? 'left' :
      (Math.random() > 0.25 ? 'left' : 'center');

    const headlinePhrases = [
      "DIE NEUE GRAPHIK",
      "RASTER SYSTEME",
      "OPTICAL CADENCE",
      "KINETIC VECTORS",
      "GEOMETRIC TENSION",
      "ARCHITECTURAL ORDER",
      "THE SUBLIME GEOMETRY",
      "CONCRETE CONSTRUCT",
      "MUSICA VIVA ZÜRICH",
      "KUNSTHALLE BASEL",
      "TONHALLE ARCHIVE",
      "FORMA & STRUTTURA"
    ];
    const randomHeadlineText = useCuratedPairing && Math.random() > 0.45
      ? pickedPairing.headlineSample
      : headlinePhrases[Math.floor(Math.random() * headlinePhrases.length)];

    const secondaryPhrases = [
      "1957 // ZÜRICH — Internationale Zeitschrift für Graphische Kunst und verwandte Gebiete.",
      "An orthogonal grid brings imagery, type, and color into intellectual and optical unity.",
      "A rigorous dialogue between Enlightenment Didone hairline brackets and grotesque vectors.",
      "Order is the prerequisite of optical clarity across architectural layouts and print media.",
      "Allgemeine Gewerbeschule Basel // Kunstgewerbeschule Zürich Typographic Specimen Engine.",
      "Josef Müller-Brockmann & Armin Hofmann: The Swiss Grid and Modernist Poster Art."
    ];
    const randomSecondaryText = useCuratedPairing && Math.random() > 0.35
      ? pickedPairing.bodySample
      : secondaryPhrases[Math.floor(Math.random() * secondaryPhrases.length)];

    // 4. Smart Luminance-Matched Texture & Blend Mode (No jarring difference/invert or washed-out contrast)
    const subtleTextures: Array<TypographicState['backgroundTexture']> = isLightBg
      ? ['crumpled-paper', 'ferrofluid-bloom', 'suminagashi-ink', 'cyanotype-plate', 'charcoal-frottage', 'burnt-vellum', 'litho-stone', 'newsprint-micro', 'photostat', 'risograph', 'linen-weave', 'letterpress-bite', 'japanese-washi', 'newsprint-halftone', 'topo-contour', 'bauhaus-grid', 'none']
      : ['darkroom', 'macro-ink', 'brutalist-vault', 'brutalist-facade', 'concrete-coffer', 'wet-collodion', 'silver-solarize', 'cyanotype-plate', 'charcoal-frottage', 'wheatpaste-fold', 'kraft-collage', 'oxidized-etching', 'celluloid-burn', 'film-grain', 'topo-contour', 'architectural-draft', 'oscilloscope-harmonic', 'concrete-formwork', 'moire-wave', 'none'];
    const randomTexture = subtleTextures[Math.floor(Math.random() * subtleTextures.length)];
    const randomBlend: TypographicState['textureBlendMode'] = isLightBg
      ? (['multiply', 'soft-light'] as const)[Math.floor(Math.random() * 2)]
      : (['overlay', 'soft-light'] as const)[Math.floor(Math.random() * 2)];
    const smartTextureOpacity = isLightBg
      ? Number((Math.random() * 0.10 + 0.14).toFixed(2))
      : Number((Math.random() * 0.10 + 0.16).toFixed(2));

    // 5. Smart Studio Specimen Plate Selection (Coordinated with palette & layout)
    const randomPlate = STUDIO_PLATES[Math.floor(Math.random() * STUDIO_PLATES.length)];
    const randomShowImage = Math.random() < 0.6;
    const placements: Array<TypographicState['imagePlacement']> = ['between', 'below', 'above'];
    const randomPlacement = placements[Math.floor(Math.random() * placements.length)];
    const smartImageBlend: TypographicState['imageBlendMode'] = isLightBg
      ? (randomPlate.category === 'Photographic' ? 'multiply' : 'normal')
      : 'normal';

    // 6. Coordinated Archival Header & Footer Metadata
    const metadataSets = [
      { l1: 'Kunsthalle Zürich // Exhibition Series', l2: 'International Typographic Style 1957', f1: 'Allgemeine Gewerbeschule Basel // Archiv', f2: 'Swiss Modular Grid System DIN 476', badge: 'Specimen Fig. 11-A' },
      { l1: 'Staatliches Bauhaus Dessau // Werkstätten', l2: 'Elementare Typographie & Photographie', f1: 'Moholy-Nagy & Herbert Bayer Press', f2: 'Constructivist Monograph Series', badge: 'Katalog Nr. 26' },
      { l1: 'Tokyo Zine & Risograph Overprint Lab', l2: 'Dual-Drum Soy Ink Separation Study', f1: 'Shibuya Graphic Press // Sector 09', f2: 'Experimental Printmaking & Halftones', badge: 'Plate // RISO-09' },
      { l1: 'Edizioni Milano // Architettura & Forma', l2: 'Collezione Tipografica Contemporanea', f1: 'Triennale di Milano // Sezione Grafica', f2: 'Proporzione Aurea & Spazio Negativo', badge: 'Tavola IV' },
      { l1: 'Tonhalle-Gesellschaft Zürich // Musica Viva', l2: 'Akustische Proportionsstudie 1955', f1: 'Josef Müller-Brockmann // Konzerthaus', f2: 'Orthogonal Mathematical Rhythm', badge: 'Opus 55-B' },
    ];
    const pickedMeta = metadataSets[Math.floor(Math.random() * metadataSets.length)];

    const frames: Array<TypographicState['canvasFrame']> = ['poster', 'square', 'editorial', 'broadsheet', 'landscape'];
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];

    // Smartly hide Header and/or Footer on self-framed layouts or compact frames with plates so text never crowds
    const hideHeader =
      randomLayout === 'brutalist-frame' ||
      randomLayout === 'index-catalog' ||
      (randomShowImage && randomFrame === 'landscape') ||
      Math.random() < 0.4;
    const hideFooter =
      randomLayout === 'brutalist-frame' ||
      (randomShowImage && (randomFrame === 'square' || randomFrame === 'landscape')) ||
      Math.random() < 0.35;

    setTypoState(prev => ({
      ...prev,
      // Headline Layer
      text: randomHeadlineText,
      fontFamily: headlineFamily,
      fontWeight: headlineWeight,
      fontSize: Math.floor(Math.random() * 18) + 42, // 42px to 59px balanced scale
      letterSpacing: headlineTracking,
      lineHeight: Number(((Math.random() * 0.18) + 0.90).toFixed(2)),
      textAlign: randomAlign,
      textTransform: Math.random() > 0.25 ? 'uppercase' : 'none',
      textColor: randomPalette.textColor,
      backgroundColor: randomPalette.backgroundColor,
      strokeWidth: 0,
      strokeColor: randomPalette.strokeColor,
      shadowGlowColor: randomPalette.shadowGlowColor,
      textShadow: false,
      skew: 0,
      rotation: 0,
      canvasFrame: randomFrame,
      posterLayout: randomLayout,
      // Secondary Pairing Layer
      showSubText: true,
      subText: randomSecondaryText,
      subFontFamily,
      subFontWeight,
      subFontSize: Math.floor(Math.random() * 3) + 12, // 12px to 14px
      subLetterSpacing,
      subTextColor: randomPalette.subTextColor,
      // Editable Header & Footer (hidden sometimes to avoid crowding)
      showHeader: !hideHeader,
      headerLeftTitle: pickedMeta.l1,
      headerLeftSubtitle: pickedMeta.l2,
      headerRightTitle: '',
      headerRightSubtitle: '',
      showFooter: !hideFooter,
      footerLeftTitle: pickedMeta.f1,
      footerLeftSubtitle: pickedMeta.f2,
      footerRightBadge: pickedMeta.badge,
      // Keep background clean of random numbers/characters and green crosshairs by default
      showWatermark: false,
      showGrid: false,
      // Smart Graphic Texture & Modifiers
      backgroundTexture: randomTexture,
      textureOpacity: smartTextureOpacity,
      textureBlendMode: randomBlend,
      textureScale: 100,
      textureContrast: 105,
      textureBrightness: 100,
      textureBlur: 0,
      textureInvert: false,
      textureTint: randomPalette.textureTint,
      // Smart Graphic Image Plate Layer
      showImageLayer: randomShowImage,
      imageUrl: randomPlate.url,
      imageCaption: randomPlate.caption,
      imagePlacement: randomPlacement,
      imageOpacity: Number((Math.random() * 0.15 + 0.85).toFixed(2)),
      imageBlendMode: smartImageBlend,
      imageFilter: 'none',
      imageHeight: Math.floor(Math.random() * 50) + 160,
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
          <div className="flex-1 min-h-0 w-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-hidden relative">
            
            {/* Mobile Workspace Segmented Mode Switcher (Visible strictly on screens < lg) */}
            <div className="lg:hidden flex items-center justify-between px-3 py-1.5 bg-[#090B0F] border-b border-[#1E232E] shrink-0 z-20">
              <div className="flex items-center gap-1 bg-[#12161F] p-0.5 border border-[#232B3B] flex-1 mr-2">
                <button
                  onClick={() => setMobilePlaygroundView('canvas')}
                  className={`flex-1 py-1 px-2 text-xs font-bold font-mono-code transition-all flex items-center justify-center gap-1.5 ${
                    mobilePlaygroundView === 'canvas'
                      ? 'bg-[#00FF66] text-[#070809] shadow-sm font-extrabold'
                      : 'text-[#9AA2B1] hover:text-[#F4F5F7]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>01 ARTBOARD</span>
                </button>
                <button
                  onClick={() => setMobilePlaygroundView('controls')}
                  className={`flex-1 py-1 px-2 text-xs font-bold font-mono-code transition-all flex items-center justify-center gap-1.5 ${
                    mobilePlaygroundView === 'controls'
                      ? 'bg-[#00FF66] text-[#070809] shadow-sm font-extrabold'
                      : 'text-[#9AA2B1] hover:text-[#F4F5F7]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>02 CONTROLS</span>
                </button>
              </div>
              <button
                onClick={handleRandomize}
                className="px-2.5 py-1.5 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 text-xs font-bold flex items-center gap-1 shrink-0"
                title="Shuffle composition"
              >
                <Shuffle className="w-3 h-3" />
                <span>RANDOM</span>
              </button>
            </div>

            {/* Visual Canvas Artboard (7-8 cols on large screens, fits screen height without scroll) */}
            <div className={`lg:col-span-7 xl:col-span-8 h-full min-h-0 flex-col justify-between bg-[#070809] lg:border-r border-[#1E232E] relative ${
              mobilePlaygroundView === 'canvas' ? 'flex flex-1' : 'hidden lg:flex'
            }`}>
              <TypographicCanvas
                state={typoState}
                onChangeText={(text) => handleUpdateState({ text })}
                onChangeSubText={(subText) => handleUpdateState({ subText })}
                onUpdateState={handleUpdateState}
                onChangeTexture={(bg) => handleUpdateState({ backgroundTexture: bg })}
                canvasRef={canvasRef}
                onAutoFitSize={handleAutoFitSize}
                activeLayer={activeLayer}
                onSelectLayer={setActiveLayer}
              />
              
              {/* Floating Quick Action Button on Mobile to jump into controls */}
              <button
                onClick={() => setMobilePlaygroundView('controls')}
                className="lg:hidden fixed bottom-4 right-4 z-30 px-3.5 py-2 bg-[#00FF66] text-[#070809] font-mono-code font-bold text-xs shadow-2xl flex items-center gap-2 border border-black/30 hover:bg-[#4DFF95] transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>OPEN CONTROLS</span>
              </button>
            </div>

            {/* Interactive Control Dock (4-5 cols on large screens, fixed studio height) */}
            <div className={`lg:col-span-5 xl:col-span-4 h-full min-h-0 flex-col overflow-hidden bg-[#111317] relative ${
              mobilePlaygroundView === 'controls' ? 'flex flex-1' : 'hidden lg:flex'
            }`}>
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
                onViewArtboard={() => setMobilePlaygroundView('canvas')}
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
