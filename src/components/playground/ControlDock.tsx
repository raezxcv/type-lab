import React, { useState } from 'react';
import type { TypographicState, FontDefinition, FontPairing, ColorPalette, PosterLayout } from '../../types';
import { AVAILABLE_FONTS } from '../../data/fonts';
import { SPECIMEN_PRESETS } from '../../data/presets';
import { CURATED_PAIRINGS } from '../../data/pairings';
import { CURATED_PALETTES, STUDIO_SWATCHES } from '../../data/palettes';
import { STUDIO_PLATES } from '../../data/plates';
import { VisualFontPicker } from './VisualFontPicker';
import { 
  Type, 
  Sliders, 
  RotateCcw, 
  Palette, 
  Zap, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Grid,
  ArrowRightLeft,
  Image as ImageIcon,
  Copy,
  Check,
  Columns,
  Shuffle,
  ChevronRight,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

interface ControlDockProps {
  state: TypographicState;
  onChange: (updates: Partial<TypographicState>) => void;
  onReset: () => void;
  onCopyCSS: () => void;
  onAutoFitSize: () => void;
  customFonts: FontDefinition[];
  onUploadCustomFont: (font: FontDefinition) => void;
  activeLayer?: 'headline' | 'secondary';
  onSelectLayer?: (layer: 'headline' | 'secondary') => void;
  onViewArtboard?: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  state,
  onChange,
  onReset,
  onCopyCSS,
  onAutoFitSize,
  customFonts,
  onUploadCustomFont,
  activeLayer: externalActiveLayer,
  onSelectLayer,
  onViewArtboard,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'type' | 'pairings' | 'effects' | 'canvas'>('type');
  const [internalActiveLayer, setInternalActiveLayer] = useState<'headline' | 'secondary'>('headline');
  const [fontPickerTarget, setFontPickerTarget] = useState<'headline' | 'secondary' | null>(null);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [pairingCategoryFilter, setPairingCategoryFilter] = useState<'ALL' | FontPairing['category']>('ALL');
  const [paletteCategoryFilter, setPaletteCategoryFilter] = useState<'ALL' | ColorPalette['category']>('ALL');
  const [textureCategoryFilter, setTextureCategoryFilter] = useState<string>('ALL');
  const [plateCategoryFilter, setPlateCategoryFilter] = useState<string>('ALL');

  const activeLayer = externalActiveLayer !== undefined ? externalActiveLayer : internalActiveLayer;
  const setActiveLayer = (layer: 'headline' | 'secondary') => {
    setInternalActiveLayer(layer);
    onSelectLayer?.(layer);
  };

  const allFonts = [...AVAILABLE_FONTS, ...customFonts];

  const headlineFontObj = allFonts.find(f => f.cssFamily === state.fontFamily) || allFonts[0];
  const secondaryFontObj = allFonts.find(f => f.cssFamily === state.subFontFamily) || allFonts[1];

  const samplePhrases = [
    "FORM FOLLOWS FUNCTION FOLLOWS FORM",
    "DIE NEUE GRAPHIK // ZÜRICH 1957",
    "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    "KINETIC SYNAPSE VOL. 11",
    "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "CONSTRUCTIVE DECONSTRUCTION OF THE LETTERFORM",
    "HYDROGEN LINE 1420.40575 MHz [LOCKED]"
  ];

  const secondarySamplePhrases = [
    "1957 // ZÜRICH — Internationale Zeitschrift für Graphische Kunst und verwandte Gebiete.",
    "Order is the prerequisite of optical clarity across architectural grids.",
    "A dialogue between Enlightenment Didone hairline brackets and grotesque vectors.",
    "Telemetry coordinates locked. Optical vectors stabilized across all axes.",
    "An orthogonal grid brings imagery, type, and color into intellectual and optical unity.",
    "Vertical compression creates undeniable spatial dominance across massive architectural poster canvases.",
    "Digital letterforms are mathematical Bézier curves undergoing continuous kinetic transformation."
  ];

  const handleCopyCSS = () => {
    onCopyCSS();
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleInvertColors = () => {
    onChange({
      textColor: state.backgroundColor,
      backgroundColor: state.textColor,
    });
  };

  const handleApplyPairing = (pairing: FontPairing) => {
    onChange({
      fontFamily: pairing.headlineFamily,
      fontWeight: pairing.headlineWeight,
      letterSpacing: pairing.headlineTracking,
      subFontFamily: pairing.bodyFamily,
      subFontWeight: pairing.bodyWeight,
      subLetterSpacing: pairing.bodyTracking,
      showSubText: true,
      subText: pairing.bodySample,
    });
  };

  const handleShufflePairing = () => {
    const randomPairing = CURATED_PAIRINGS[Math.floor(Math.random() * CURATED_PAIRINGS.length)];
    handleApplyPairing(randomPairing);
  };

  const handleApplyPalette = (palette: ColorPalette) => {
    onChange({
      backgroundColor: palette.backgroundColor,
      textColor: palette.textColor,
      subTextColor: palette.subTextColor,
      strokeColor: palette.strokeColor,
      shadowGlowColor: palette.shadowGlowColor,
      textureTint: palette.textureTint,
    });
  };

  const handleShufflePalette = () => {
    const randomPalette = CURATED_PALETTES[Math.floor(Math.random() * CURATED_PALETTES.length)];
    handleApplyPalette(randomPalette);
  };

  const handleShuffleSecondary = () => {
    const eligibleFonts = allFonts.filter(f => f.cssFamily !== state.fontFamily);
    const randomFont = eligibleFonts.length > 0 ? eligibleFonts[Math.floor(Math.random() * eligibleFonts.length)] : allFonts[0];
    const bodyWeights = randomFont.weights.filter(w => w <= 600);
    const randomWeight = bodyWeights.length > 0 ? bodyWeights[Math.floor(Math.random() * bodyWeights.length)] : randomFont.weights[0];
    const randomPhrase = secondarySamplePhrases[Math.floor(Math.random() * secondarySamplePhrases.length)];
    const randomSize = Math.floor(Math.random() * 4) + 12;
    const randomTracking = Number(((Math.random() * 0.06) + 0.02).toFixed(2));
    const accentColors = ['#00FF66', '#F4F5F7', '#FFB800', '#00E5FF'];
    const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];

    onChange({
      showSubText: true,
      subFontFamily: randomFont.cssFamily,
      subFontWeight: randomWeight,
      subFontSize: randomSize,
      subLetterSpacing: randomTracking,
      subTextColor: randomColor,
      subText: randomPhrase,
    });
  };

  const handleShuffleHeadline = () => {
    const randomFont = allFonts[Math.floor(Math.random() * allFonts.length)];
    const randomWeight = randomFont.weights[Math.floor(Math.random() * randomFont.weights.length)];
    const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    const randomSize = Math.floor(Math.random() * 20) + 42;
    const randomTracking = Number(((Math.random() * 0.2) - 0.04).toFixed(2));
    onChange({
      fontFamily: randomFont.cssFamily,
      fontWeight: randomWeight,
      fontSize: randomSize,
      letterSpacing: randomTracking,
      text: randomPhrase,
    });
  };

  const handleShuffleTextureModifiers = () => {
    const blendModes: Array<TypographicState['textureBlendMode']> = [
      'overlay', 'screen', 'multiply', 'hard-light', 'soft-light', 'difference', 'color-dodge'
    ];
    const tints: Array<TypographicState['textureTint']> = [
      'none', 'green', 'amber', 'cyan', 'crimson', 'violet', 'cobalt', 'acid-lime', 'copper', 'monochrome'
    ];
    const randomBlend = blendModes[Math.floor(Math.random() * blendModes.length)];
    const randomTint = tints[Math.floor(Math.random() * tints.length)];
    const randomOpacity = Number((Math.random() * 0.45 + 0.25).toFixed(2));
    const randomScale = [75, 100, 125, 150, 175, 200][Math.floor(Math.random() * 6)];
    const randomContrast = [80, 100, 120, 150, 180][Math.floor(Math.random() * 5)];
    const randomBrightness = [80, 100, 110, 130][Math.floor(Math.random() * 4)];
    const randomBlur = [0, 0, 1, 2, 4][Math.floor(Math.random() * 5)];
    const randomInvert = Math.random() > 0.65;

    onChange({
      textureOpacity: randomOpacity,
      textureBlendMode: randomBlend,
      textureScale: randomScale,
      textureContrast: randomContrast,
      textureBrightness: randomBrightness,
      textureBlur: randomBlur,
      textureInvert: randomInvert,
      textureTint: randomTint,
    });
  };

  const handleResetTextureModifiers = () => {
    onChange({
      textureOpacity: 0.65,
      textureBlendMode: 'normal',
      textureScale: 100,
      textureContrast: 110,
      textureBrightness: 105,
      textureBlur: 0,
      textureInvert: false,
      textureTint: 'none',
      textureRepeat: 'cover',
    });
  };

  const showType = activeMainTab === 'type';
  const showPairings = activeMainTab === 'pairings';
  const showEffects = activeMainTab === 'effects';
  const showCanvas = activeMainTab === 'canvas';

  return (
    <div className="w-full bg-[#111317] border-t lg:border-t-0 lg:border-l border-[#22262E] text-xs font-mono-code flex flex-col h-full min-h-0">
      
      {/* Primary Navigation Tabs — 4 Column Grid with Prominent Active Indicator */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-[#0A0C10] border-b border-[#22262E] shrink-0">
        {[
          { id: 'type', num: '01', label: 'TYPE', icon: Type },
          { id: 'pairings', num: '02', label: 'PAIRS', icon: Columns },
          { id: 'effects', num: '03', label: 'EFFECTS', icon: Sliders },
          { id: 'canvas', num: '04', label: 'CANVAS', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`relative p-2.5 flex flex-col items-center justify-center text-center transition-all border ${
                isActive
                  ? 'border-[#00FF66] bg-[#142318] text-[#00FF66] font-bold shadow-[0_0_12px_rgba(0,255,102,0.15)] ring-1 ring-[#00FF66]/50'
                  : 'border-[#1E232E] bg-[#0E1117] text-[#9AA2B1] hover:text-[#F4F5F7] hover:border-[#333C4D] hover:bg-[#121620]'
              }`}
              title={`Switch to Tab ${tab.num}: ${tab.label}`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
              )}
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00FF66]' : 'text-[#8E97A8]'}`} />
                <span className="text-xs font-bold font-mono-code">{tab.num}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse inline-block" />
                )}
              </div>
              <span className="text-xs font-bold mt-1 truncate w-full tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Control Panel Body — Discrete Tab Viewport */}
      <div className="p-4 sm:p-5 space-y-6 overflow-y-auto flex-1 min-h-0">

        {/* ==================== SECTION 1: TYPE & PAIRING DUAL-LAYER CONTROLLER ==================== */}
        {showType && (
          <div id="panel-section-type" className="space-y-5 pb-2">
            {/* Dual Layer Segmented Switcher */}
            <div className="p-1.5 bg-[#0D0F14] border border-[#22262E] flex items-center gap-1.5">
              <button
                onClick={() => setActiveLayer('headline')}
                className={`flex-1 py-2 px-3 text-left transition-all border ${
                  activeLayer === 'headline'
                    ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                    : 'border-transparent text-[#9AA2B1] hover:text-[#F4F5F7]'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">LAYER A: PRIMARY HEADLINE</div>
                <div className="text-xs font-semibold text-[#F4F5F7] truncate mt-0.5" style={{ fontFamily: state.fontFamily }}>
                  {headlineFontObj.name} ({state.fontSize}px)
                </div>
              </button>

              <button
                onClick={() => setActiveLayer('secondary')}
                className={`flex-1 py-2 px-3 text-left transition-all border relative ${
                  activeLayer === 'secondary'
                    ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                    : 'border-transparent text-[#9AA2B1] hover:text-[#F4F5F7]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider">LAYER B: PAIRING TEXT</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    state.showSubText ? 'bg-[#00FF66] text-black' : 'bg-[#22262E] text-[#CBD5E1]'
                  }`}>
                    {state.showSubText ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#F4F5F7] truncate mt-0.5" style={{ fontFamily: state.subFontFamily }}>
                  {secondaryFontObj.name} ({state.subFontSize}px)
                </div>
              </button>
            </div>

            {/* --- ACTIVE LAYER: HEADLINE --- */}
            {activeLayer === 'headline' && (
              <div className="space-y-4 pt-1">
                
                {/* Headline Text Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="font-semibold text-[#F4F5F7] flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#00FF66]"></span>
                      HEADLINE TEXT
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShuffleHeadline}
                        className="text-xs text-[#00FF66] hover:text-[#4DFF95] flex items-center gap-1 transition-colors"
                        title="Randomize headline font, weight and phrase"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>SHUFFLE</span>
                      </button>
                      <span className="text-[#3A4250]">|</span>
                      <span className="text-xs text-[#A1A1AA]">{state.text.length} Chars</span>
                    </div>
                  </div>
                  
                  <textarea
                    value={state.text}
                    onChange={(e) => onChange({ text: e.target.value })}
                    className="w-full bg-[#0D0F14] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-3 text-xs font-mono-code rounded-none resize-y min-h-[64px] focus:outline-none"
                    placeholder="Enter headline copy..."
                  />

                  {/* Sample Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-[#C2CAD8] uppercase font-semibold shrink-0">Sample:</span>
                    {samplePhrases.slice(0, 3).map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => onChange({ text: phrase })}
                        className="px-2.5 py-1 bg-[#171B24] hover:bg-[#222836] text-[#C2CAD8] hover:text-[#00FF66] border border-[#232A38] whitespace-nowrap transition-colors shrink-0"
                      >
                        {phrase.length > 20 ? phrase.slice(0, 20) + '...' : phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headline Font Selector Button with Visual Display */}
                <div className="space-y-1.5 pt-2 border-t border-[#1E232E]">
                  <label className="text-[#A1A1AA] block text-xs font-semibold">
                    HEADLINE TYPEFACE
                  </label>
                  <button
                    onClick={() => setFontPickerTarget('headline')}
                    className="w-full p-3 bg-[#0D0F14] border border-[#272F3E] hover:border-[#00FF66] transition-all flex items-center justify-between group text-left"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#F4F5F7] group-hover:text-[#00FF66] transition-colors">
                        {headlineFontObj.name}
                      </div>
                      <div className="text-base text-[#E2E8F0] truncate mt-0.5" style={{ fontFamily: state.fontFamily }}>
                        {headlineFontObj.sampleText || 'Abcdefghijklmnopqrstuvwxyz'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#00FF66] font-bold shrink-0">
                      <span>CHANGE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>

                {/* Font Size & Weight Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Size Slider + Steppers + Fit */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        SIZE
                        <button
                          onClick={onAutoFitSize}
                          className="px-1.5 py-0.2 bg-[#1A251E] text-[#00FF66] text-[11px] font-bold border border-[#00FF66]/40 hover:bg-[#00FF66] hover:text-black transition-colors"
                          title="Auto fit text size to frame"
                        >
                          FIT
                        </button>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onChange({ fontSize: Math.max(12, state.fontSize - 5) })}
                          className="px-1.5 py-0.2 bg-[#1A1F29] text-[#C2CAD8] hover:text-[#00FF66]"
                        >
                          -5
                        </button>
                        <span className="text-[#00FF66] font-bold min-w-[36px] text-center">{state.fontSize}px</span>
                        <button
                          onClick={() => onChange({ fontSize: Math.min(180, state.fontSize + 5) })}
                          className="px-1.5 py-0.2 bg-[#1A1F29] text-[#C2CAD8] hover:text-[#00FF66]"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="180"
                      step="1"
                      value={state.fontSize}
                      onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Weight Slider + Quick Pills */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>WEIGHT</span>
                      <span className="text-[#00FF66] font-bold">{state.fontWeight}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="100"
                      value={state.fontWeight}
                      onChange={(e) => onChange({ fontWeight: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[11px] text-[#71717A] pt-0.5">
                      {[300, 400, 600, 700, 900].map((w) => (
                        <button
                          key={w}
                          onClick={() => onChange({ fontWeight: w })}
                          className={`hover:text-[#00FF66] ${state.fontWeight === w ? 'text-[#00FF66] font-bold' : ''}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tracking & Leading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>TRACKING</span>
                      <span className="text-[#00FF66] font-bold">{state.letterSpacing.toFixed(2)}em</span>
                    </div>
                    <input
                      type="range"
                      min="-0.10"
                      max="0.80"
                      step="0.01"
                      value={state.letterSpacing}
                      onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>LEADING</span>
                      <span className="text-[#00FF66] font-bold">{state.lineHeight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.60"
                      max="2.20"
                      step="0.05"
                      value={state.lineHeight}
                      onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Alignment, Transform & Color */}
                <div className="space-y-2.5 pt-3 border-t border-[#1E232E]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Alignment */}
                    <div className="flex border border-[#22262E] bg-[#0D0F14]">
                      {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => onChange({ textAlign: align })}
                          className={`p-2 transition-colors ${
                            state.textAlign === align
                              ? 'bg-[#1F2533] text-[#00FF66]'
                              : 'text-[#A1A1AA] hover:text-[#F4F5F7]'
                          }`}
                          title={`Align ${align}`}
                        >
                          {align === 'left' && <AlignLeft className="w-4 h-4" />}
                          {align === 'center' && <AlignCenter className="w-4 h-4" />}
                          {align === 'right' && <AlignRight className="w-4 h-4" />}
                          {align === 'justify' && <AlignJustify className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>

                    {/* Transform Case */}
                    <div className="flex border border-[#22262E] bg-[#0D0F14]">
                      {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((transform) => (
                        <button
                          key={transform}
                          onClick={() => onChange({ textTransform: transform })}
                          className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                            state.textTransform === transform
                              ? 'bg-[#1F2533] text-[#00FF66]'
                              : 'text-[#A1A1AA] hover:text-[#F4F5F7]'
                          }`}
                        >
                          {transform === 'none' ? 'Aa' : transform === 'uppercase' ? 'AA' : transform === 'lowercase' ? 'aa' : 'Ab'}
                        </button>
                      ))}
                    </div>

                    {/* Italic */}
                    <button
                      onClick={() => onChange({ isItalic: !state.isItalic })}
                      className={`px-3 py-1.5 text-xs italic font-serif border border-[#22262E] transition-colors ${
                        state.isItalic ? 'bg-[#1F2533] text-[#00FF66] border-[#00FF66]' : 'text-[#A1A1AA] bg-[#0D0F14]'
                      }`}
                    >
                      Italic
                    </button>
                  </div>

                  {/* Headline Color */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A1A1AA] text-xs font-semibold">HEADLINE COLOR</span>
                      <span className="text-[#00FF66] font-bold uppercase text-xs">{state.textColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.textColor}
                        onChange={(e) => onChange({ textColor: e.target.value })}
                        className="w-7 h-7 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0 shrink-0"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {STUDIO_SWATCHES.slice(0, 14).map((s) => (
                          <button
                            key={s.hex}
                            onClick={() => onChange({ textColor: s.hex })}
                            className={`w-5 h-5 border transition-transform hover:scale-110 ${
                              state.textColor.toLowerCase() === s.hex.toLowerCase()
                                ? 'border-[#00FF66] ring-1 ring-[#00FF66]'
                                : 'border-[#2B3342]'
                            }`}
                            style={{ backgroundColor: s.hex }}
                            title={`${s.label} (${s.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* --- ACTIVE LAYER: SECONDARY PAIRING --- */}
            {activeLayer === 'secondary' && (
              <div className="space-y-4 pt-1">
                
                {/* Layer Toggle Banner */}
                <div className="p-3 bg-[#0D0F14] border border-[#22262E] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#F4F5F7] block text-xs">PAIRING LAYER STATUS</span>
                    <span className="text-[11px] text-[#A1A1AA]">Renders complementary subhead or caption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShuffleSecondary}
                      className="px-2.5 py-1 text-xs font-bold border border-[#22262E] bg-[#121620] hover:border-[#00FF66] text-[#00FF66] flex items-center gap-1.5 transition-colors"
                      title="Randomize secondary font, size, weight & phrase"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>SHUFFLE</span>
                    </button>
                    <button
                      onClick={() => onChange({ showSubText: !state.showSubText })}
                      className={`px-3 py-1 text-xs font-bold border transition-colors ${
                        state.showSubText
                          ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                          : 'border-[#22262E] text-[#A1A1AA]'
                      }`}
                    >
                      {state.showSubText ? 'ENABLED (VISIBLE)' : 'DISABLED (HIDDEN)'}
                    </button>
                  </div>
                </div>

                {/* Secondary Text Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="font-semibold text-[#F4F5F7] flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#00FF66]"></span>
                      SECONDARY PAIRING TEXT
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShuffleSecondary}
                        className="text-xs text-[#00FF66] hover:text-[#4DFF95] flex items-center gap-1 transition-colors"
                        title="Randomize secondary font, weight, color & text"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>SHUFFLE</span>
                      </button>
                      <span className="text-[#3A4250]">|</span>
                      <span className="text-xs text-[#A1A1AA]">{state.subText.length} Chars</span>
                    </div>
                  </div>
                  
                  <textarea
                    value={state.subText}
                    onChange={(e) => onChange({ subText: e.target.value })}
                    className="w-full bg-[#0D0F14] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-3 text-xs font-mono-code rounded-none resize-y min-h-[64px] focus:outline-none"
                    placeholder="Enter secondary subheadline or body text..."
                  />

                  {/* Sample Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-[#C2CAD8] uppercase font-semibold shrink-0">Sample:</span>
                    {secondarySamplePhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => onChange({ subText: phrase })}
                        className="px-2.5 py-1 bg-[#171B24] hover:bg-[#222836] text-[#C2CAD8] hover:text-[#00FF66] border border-[#232A38] whitespace-nowrap transition-colors shrink-0"
                      >
                        {phrase.length > 20 ? phrase.slice(0, 20) + '...' : phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Font Selector Button with Visual Display */}
                <div className="space-y-1.5 pt-2 border-t border-[#1E232E]">
                  <label className="text-[#A1A1AA] block text-xs font-semibold">
                    SECONDARY PAIRING TYPEFACE (DISTINCT FONT)
                  </label>
                  <button
                    onClick={() => setFontPickerTarget('secondary')}
                    className="w-full p-3 bg-[#0D0F14] border border-[#272F3E] hover:border-[#00FF66] transition-all flex items-center justify-between group text-left"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#F4F5F7] group-hover:text-[#00FF66] transition-colors">
                        {secondaryFontObj.name} [{secondaryFontObj.category.toUpperCase()}]
                      </div>
                      <div className="text-base text-[#E2E8F0] truncate mt-0.5" style={{ fontFamily: state.subFontFamily }}>
                        {secondaryFontObj.sampleText || 'Abcdefghijklmnopqrstuvwxyz'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#00FF66] font-bold shrink-0">
                      <span>CHANGE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>

                {/* Secondary Size & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>PAIRING SIZE</span>
                      <span className="text-[#00FF66] font-bold">{state.subFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="48"
                      value={state.subFontSize}
                      onChange={(e) => onChange({ subFontSize: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>PAIRING WEIGHT</span>
                      <span className="text-[#00FF66] font-bold">{state.subFontWeight}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="900"
                      step="100"
                      value={state.subFontWeight}
                      onChange={(e) => onChange({ subFontWeight: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Secondary Tracking & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>PAIRING TRACKING</span>
                      <span className="text-[#00FF66] font-bold">{state.subLetterSpacing.toFixed(2)}em</span>
                    </div>
                    <input
                      type="range"
                      min="-0.05"
                      max="0.40"
                      step="0.01"
                      value={state.subLetterSpacing}
                      onChange={(e) => onChange({ subLetterSpacing: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span>PAIRING COLOR</span>
                      <span className="text-[#00FF66] uppercase">{state.subTextColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.subTextColor}
                        onChange={(e) => onChange({ subTextColor: e.target.value })}
                        className="w-7 h-7 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0 shrink-0"
                      />
                      <div className="flex flex-wrap gap-1">
                        {STUDIO_SWATCHES.slice(0, 12).map((s) => (
                          <button
                            key={s.hex}
                            onClick={() => onChange({ subTextColor: s.hex })}
                            className={`w-5 h-5 border hover:scale-110 transition-transform ${
                              state.subTextColor.toLowerCase() === s.hex.toLowerCase()
                                ? 'border-[#00FF66] ring-1 ring-[#00FF66]'
                                : 'border-[#2B3342]'
                            }`}
                            style={{ backgroundColor: s.hex }}
                            title={`${s.label} (${s.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* --- EDITABLE HEADER & FOOTER METADATA CONTROLLER --- */}
            <div className="p-3.5 bg-[#0D0F14] border border-[#22262E] space-y-3 mt-4">
              <div className="flex items-center justify-between border-b border-[#1E232E] pb-2">
                <div>
                  <span className="font-bold text-[#F4F5F7] text-xs block">POSTER HEADER & FOOTER METADATA</span>
                  <span className="text-[11px] text-[#A1A1AA]">Editable here or directly on the poster artboard</span>
                </div>
                <button
                  onClick={() => {
                    const headers = [
                      { l1: 'Kunsthalle Zürich // Exhibition Series', l2: 'International Typographic Style 1957', f1: 'Allgemeine Gewerbeschule Basel // Archiv', f2: 'Swiss Modular Grid System DIN 476', badge: 'Specimen Fig. 11-A' },
                      { l1: 'Staatliches Bauhaus Dessau // Werkstätten', l2: 'Elementare Typographie & Photographie', f1: 'Moholy-Nagy & Herbert Bayer Press', f2: 'Constructivist Monograph Series', badge: 'Katalog Nr. 26' },
                      { l1: 'Tokyo Zine & Risograph Overprint Lab', l2: 'Dual-Drum Soy Ink Separation Study', f1: 'Shibuya Graphic Press // Sector 09', f2: 'Experimental Printmaking & Halftones', badge: 'Plate // RISO-09' },
                      { l1: 'Radio Astronomy Telemetry Console', l2: 'Hydrogen Line 1420.405 MHz Calibration', f1: 'Observatory Vector Display Terminal', f2: 'Oscilloscope Phase-Lock Matrix', badge: 'SYS_LOCK [OK]' },
                      { l1: 'Edizioni Milano // Architettura & Forma', l2: 'Collezione Tipografica Contemporanea', f1: 'Triennale di Milano // Sezione Grafica', f2: 'Proporzione Aurea & Spazio Negativo', badge: 'Tavola IV' },
                    ];
                    const pick = headers[Math.floor(Math.random() * headers.length)];
                    onChange({
                      showHeader: true,
                      showFooter: true,
                      headerLeftTitle: pick.l1,
                      headerLeftSubtitle: pick.l2,
                      footerLeftTitle: pick.f1,
                      footerLeftSubtitle: pick.f2,
                      footerRightBadge: pick.badge,
                    });
                  }}
                  className="px-2.5 py-1 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Randomize archival header and footer metadata"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>SHUFFLE</span>
                </button>
              </div>

              {/* Header Toggle & Inputs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C2CAD8]">TOP HEADER BAR</span>
                  <button
                    onClick={() => onChange({ showHeader: state.showHeader === false ? true : false })}
                    className={`px-2 py-0.5 text-xs font-bold border ${
                      state.showHeader !== false ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C]' : 'border-[#22262E] text-[#808898]'
                    }`}
                  >
                    {state.showHeader !== false ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
                {state.showHeader !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={state.headerLeftTitle ?? "Type Laboratory Experimental Specimen"}
                      onChange={(e) => onChange({ headerLeftTitle: e.target.value })}
                      placeholder="Header Left Title"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#F4F5F7] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={state.headerLeftSubtitle ?? "Series: Kinetic Swiss Modernism"}
                      onChange={(e) => onChange({ headerLeftSubtitle: e.target.value })}
                      placeholder="Header Left Subtitle"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#A1A1AA] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={state.headerRightTitle ?? ""}
                      onChange={(e) => onChange({ headerRightTitle: e.target.value })}
                      placeholder="Header Right (Leave blank for auto Font Name)"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#F4F5F7] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={state.headerRightSubtitle ?? ""}
                      onChange={(e) => onChange({ headerRightSubtitle: e.target.value })}
                      placeholder="Right Sub (Leave blank for auto Size/Leading)"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#A1A1AA] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Footer Toggle & Inputs */}
              <div className="space-y-2 pt-2 border-t border-[#1A1F29]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C2CAD8]">BOTTOM FOOTER BAR</span>
                  <button
                    onClick={() => onChange({ showFooter: state.showFooter === false ? true : false })}
                    className={`px-2 py-0.5 text-xs font-bold border ${
                      state.showFooter !== false ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C]' : 'border-[#22262E] text-[#808898]'
                    }`}
                  >
                    {state.showFooter !== false ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
                {state.showFooter !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={state.footerLeftTitle ?? "Allgemeine Gewerbeschule Basel // Zürich Tonhalle"}
                      onChange={(e) => onChange({ footerLeftTitle: e.target.value })}
                      placeholder="Footer Left Title"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#F4F5F7] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={state.footerLeftSubtitle ?? "Type Playground Digital Specimen Engine"}
                      onChange={(e) => onChange({ footerLeftSubtitle: e.target.value })}
                      placeholder="Footer Left Subtitle"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#A1A1AA] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={state.footerRightBadge ?? "Specimen Fig. 11-A"}
                      onChange={(e) => onChange({ footerRightBadge: e.target.value })}
                      placeholder="Footer Right Badge"
                      className="bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] px-2.5 py-1.5 text-xs text-[#00FF66] font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==================== SECTION 2: PAIRINGS GALLERY ==================== */}
        {showPairings && (
          <div id="panel-section-pairings" className="space-y-4 pb-2">
            {/* Header with Shuffle */}
            <div className="flex items-center justify-between p-3 bg-[#0D0F14] border border-[#22262E]">
              <div>
                <span className="font-bold text-[#F4F5F7] block text-xs">STUDIO PAIRING ENGINE</span>
                <span className="text-[11px] text-[#A1A1AA]">{CURATED_PAIRINGS.length} curated historical & contemporary duos</span>
              </div>
              <button
                onClick={handleShufflePairing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 font-bold text-xs transition-colors"
                title="Randomize harmonious font pairing"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>SHUFFLE PAIR</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'Modernist Swiss', 'Editorial Serif', 'Cyber Brutalist', 'Industrial Minimal', 'Classical Roman'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPairingCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-mono-code border transition-colors ${
                    pairingCategoryFilter === cat
                      ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                      : 'border-[#22262E] bg-[#0D0F14] text-[#9AA2B1] hover:text-[#F4F5F7]'
                  }`}
                >
                  {cat === 'ALL' ? `ALL (${CURATED_PAIRINGS.length})` : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Curated Pairing Cards */}
            <div className="space-y-3">
              {CURATED_PAIRINGS.filter(p => pairingCategoryFilter === 'ALL' || p.category === pairingCategoryFilter).map((pairing) => (
                <div
                  key={pairing.id}
                  className="p-4 border border-[#22262E] bg-[#0A0C10] hover:border-[#00FF66] transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#F4F5F7] text-xs group-hover:text-[#00FF66] transition-colors">
                        {pairing.name}
                      </span>
                      <span className="text-xs text-[#CBD5E1] block mt-0.5">{pairing.category}</span>
                    </div>
                    <button
                      onClick={() => handleApplyPairing(pairing)}
                      className="px-3 py-1.5 bg-[#00FF66] text-black font-bold text-xs hover:bg-[#4DFF95] transition-colors"
                    >
                      APPLY PAIRING
                    </button>
                  </div>

                  {/* Dual font preview */}
                  <div className="p-3 bg-[#11141A] border border-[#1A1F29] space-y-1.5">
                    <div 
                      className="text-lg font-bold text-[#F4F5F7] truncate leading-tight"
                      style={{ 
                        fontFamily: pairing.headlineFamily,
                        letterSpacing: `${pairing.headlineTracking}em`,
                        fontWeight: pairing.headlineWeight
                      }}
                    >
                      {pairing.headlineSample}
                    </div>
                    <div 
                      className="text-xs text-[#00FF66] line-clamp-2 leading-relaxed"
                      style={{ 
                        fontFamily: pairing.bodyFamily,
                        letterSpacing: `${pairing.bodyTracking}em`,
                        fontWeight: pairing.bodyWeight
                      }}
                    >
                      {pairing.bodySample}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#CBD5E1]">
                    <span>{pairing.headlineFamily.split(',')[0].replace(/['"]/g, '')} + {pairing.bodyFamily.split(',')[0].replace(/['"]/g, '')}</span>
                    <span className="text-[#A1A1AA] line-clamp-1 max-w-[200px]">{pairing.description}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== SECTION 3: EFFECTS & WATERMARK ==================== */}
        {showEffects && (
          <div id="panel-section-effects" className="space-y-5 pb-2">
            {/* Kinetic Animation Modes */}
            <div className="space-y-2">
              <label className="text-[#A1A1AA] block text-xs font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00FF66]" />
                KINETIC MOTION ENGINE (06 MODES)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'STATIC STATE' },
                  { id: 'marquee', label: 'KINETIC MARQUEE' },
                  { id: 'breath', label: 'VARIABLE BREATH' },
                  { id: 'skew-wobble', label: 'SKEW OSCILLATION' },
                  { id: 'stagger-split', label: 'STAGGER SPLIT' },
                  { id: 'glitch-pulse', label: 'CHROMATIC GLITCH' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onChange({ kineticMode: mode.id as any })}
                    className={`p-2.5 text-left border transition-all ${
                      state.kineticMode === mode.id
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                    }`}
                  >
                    <div className="text-xs font-bold">{mode.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vector Stroke Controls */}
            <div className="space-y-3 pt-3 border-t border-[#1E232E]">
              <span className="text-[#A1A1AA] block text-xs font-semibold">
                VECTOR STROKE // OUTLINE MODE
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[#A1A1AA]">
                    <span>STROKE WIDTH</span>
                    <span className="text-[#00FF66] font-bold">{state.strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={state.strokeWidth}
                    onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[#A1A1AA]">
                    <span>STROKE COLOR</span>
                    <span className="text-[#A1A1AA] uppercase">{state.strokeColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.strokeColor}
                      onChange={(e) => onChange({ strokeColor: e.target.value })}
                      className="w-8 h-8 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                    />
                    <div className="flex gap-1.5">
                      {['#00FF66', '#FFFFFF', '#070809', '#FFB800'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => onChange({ strokeColor: hex })}
                          className="w-6 h-6 border border-[#333B4A]"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skew & Rotation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1E232E]">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>SKEW ANGLE</span>
                  <span className="text-[#00FF66] font-bold">{state.skew}°</span>
                </div>
                <input
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  value={state.skew}
                  onChange={(e) => onChange({ skew: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>ROTATION</span>
                  <span className="text-[#00FF66] font-bold">{state.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={state.rotation}
                  onChange={(e) => onChange({ rotation: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Swiss Architectural Watermark Layer Controls */}
            <div className="p-3.5 bg-[#0D0F14] border border-[#22262E] space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F4F5F7] text-xs block">ARCHITECTURAL WATERMARK</span>
                  <span className="text-[11px] text-[#A1A1AA]">Massive background glyph layer</span>
                </div>
                <button
                  onClick={() => onChange({ showWatermark: !state.showWatermark })}
                  className={`px-2.5 py-0.5 text-xs font-bold border transition-colors ${
                    state.showWatermark ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C]' : 'border-[#22262E] text-[#A1A1AA]'
                  }`}
                >
                  {state.showWatermark ? 'ON' : 'OFF'}
                </button>
              </div>

              {state.showWatermark && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#A1A1AA] w-14">GLYPH:</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={state.watermarkText}
                      onChange={(e) => onChange({ watermarkText: e.target.value })}
                      className="w-20 bg-[#08090C] border border-[#22262E] text-[#00FF66] p-1.5 text-center text-xs font-bold"
                    />
                    <div className="flex gap-1">
                      {['57', '11', 'R', 'SPQR', '§', '№'].map((txt) => (
                        <button
                          key={txt}
                          onClick={() => onChange({ watermarkText: txt })}
                          className="px-2 py-1 bg-[#151922] text-[#A1A1AA] hover:text-[#00FF66] border border-[#22262E] text-[11px]"
                        >
                          {txt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[#A1A1AA] text-[11px]">
                    <span>OPACITY</span>
                    <span className="text-[#00FF66] font-bold">{Math.round(state.watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.30"
                    step="0.01"
                    value={state.watermarkOpacity}
                    onChange={(e) => onChange({ watermarkOpacity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Phosphor Glow */}
            <div className="space-y-2 pt-2 border-t border-[#1E232E]">
              <div className="flex justify-between items-center">
                <span className="text-[#A1A1AA] text-xs font-semibold">PHOSPHOR LASER GLOW</span>
                <button
                  onClick={() => onChange({ textShadow: !state.textShadow })}
                  className={`px-3 py-1 text-xs border ${
                    state.textShadow ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C] font-bold' : 'border-[#22262E] text-[#A1A1AA]'
                  }`}
                >
                  {state.textShadow ? 'GLOW: ON' : 'GLOW: OFF'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== SECTION 4: CANVAS & TEXTURES ==================== */}
        {showCanvas && (
          <div id="panel-section-canvas" className="space-y-5 pb-2">
            
            {/* Quick Invert button */}
            <button
              onClick={handleInvertColors}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#161B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#272F3E] transition-colors font-bold"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#00FF66]" />
              <span>INVERT FOREGROUND ⇄ BACKGROUND</span>
            </button>

            {/* Poster Architectural Layout Templates (8 Layouts) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[#F4F5F7] block text-xs font-semibold">
                  POSTER LAYOUT ARCHITECTURE (08)
                </label>
                <button
                  onClick={() => {
                    const layouts: PosterLayout[] = [
                      'classic-stack', 'swiss-split', 'editorial-magazine', 'brutalist-frame',
                      'center-monolith', 'diagonal-construct', 'index-catalog', 'kinetic-banner'
                    ];
                    const next = layouts[Math.floor(Math.random() * layouts.length)];
                    onChange({ posterLayout: next });
                  }}
                  className="text-xs text-[#00FF66] hover:text-[#4DFF95] flex items-center gap-1 font-bold"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>SHUFFLE LAYOUT</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'classic-stack', label: '01 // CLASSIC STACK', desc: 'Vertical Swiss hierarchy' },
                  { id: 'swiss-split', label: '02 // ASYMMETRIC SPLIT', desc: '2-col index & display grid' },
                  { id: 'editorial-magazine', label: '03 // EDITORIAL FOLIO', desc: 'Masthead + 2-col essay' },
                  { id: 'brutalist-frame', label: '04 // COMPARTMENT BOX', desc: 'Bordered structural cells' },
                  { id: 'center-monolith', label: '05 // GALLERY MONOLITH', desc: 'Centered axial symmetry' },
                  { id: 'diagonal-construct', label: '06 // CONSTRUCTIVIST', desc: 'Heavy rule bars & offset' },
                  { id: 'index-catalog', label: '07 // ARCHIVAL SHEET', desc: 'Numbered table rows' },
                  { id: 'kinetic-banner', label: '08 // BANDED STRIPS', desc: 'Full-width ruled bands' },
                ].map((lyt) => {
                  const isSelected = (state.posterLayout || 'classic-stack') === lyt.id;
                  return (
                    <button
                      key={lyt.id}
                      onClick={() => onChange({ posterLayout: lyt.id as PosterLayout })}
                      className={`p-2 text-left border transition-colors ${
                        isSelected
                          ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                          : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{lyt.label}</div>
                      <div className="text-[11px] text-[#8E97A8] truncate mt-0.5">{lyt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas Aspect Ratio Framing (8 Ratios) */}
            <div className="space-y-2 pt-2 border-t border-[#1E232E]">
              <label className="text-[#A1A1AA] block text-xs font-semibold">
                CANVAS PROPORTIONS & RATIO (08)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'poster', label: 'A4 (1:1.41)' },
                  { id: 'square', label: 'SQUARE (1:1)' },
                  { id: 'editorial', label: 'MAGAZINE (4:5)' },
                  { id: 'broadsheet', label: 'MONOLITH (9:16)' },
                  { id: 'cinema', label: 'CINEMA (16:9)' },
                  { id: 'ribbon', label: 'RIBBON (21:9)' },
                  { id: 'landscape', label: 'LANDSCAPE' },
                  { id: 'fluid', label: 'FLUID (5:4)' },
                ].map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => onChange({ canvasFrame: frame.id as any })}
                    className={`p-2 text-center text-xs border transition-colors truncate ${
                      state.canvasFrame === frame.id
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                    }`}
                  >
                    {frame.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="space-y-2.5 pt-2 border-t border-[#1E232E]">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>BACKGROUND COLOR (24 SWATCHES)</span>
                <span className="text-[#00FF66] font-bold uppercase">{state.backgroundColor}</span>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-8 h-8 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0 shrink-0"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {STUDIO_SWATCHES.map((item) => (
                    <button
                      key={item.hex}
                      onClick={() => onChange({ backgroundColor: item.hex })}
                      className={`w-6 h-6 border relative hover:scale-110 transition-transform ${
                        state.backgroundColor.toLowerCase() === item.hex.toLowerCase()
                          ? 'border-[#00FF66] ring-1 ring-[#00FF66]'
                          : 'border-[#2B3342]'
                      }`}
                      style={{ backgroundColor: item.hex }}
                      title={`${item.label} (${item.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ==================== STUDIO COLOR PALETTE ENGINE (20 PALETTES) ==================== */}
            <div className="space-y-3 pt-3 border-t border-[#1E232E]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[#F4F5F7] text-xs font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#00FF66]" />
                    <span>STUDIO COLOR PALETTES ({CURATED_PALETTES.length})</span>
                  </label>
                  <span className="text-[11px] text-[#A1A1AA] block mt-0.5">
                    Harmonized background, headline, pairing & tint schemes
                  </span>
                </div>
                <button
                  onClick={handleShufflePalette}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 font-bold text-xs transition-colors"
                  title="Shuffle studio color palette"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>SHUFFLE</span>
                </button>
              </div>

              {/* Palette Category Filter */}
              <div className="flex flex-wrap gap-1">
                {(['ALL', 'Swiss Modernist', 'Editorial Print', 'Cyber Brutalist', 'Risograph Ink', 'Darkroom Monochrome'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPaletteCategoryFilter(cat)}
                    className={`px-2 py-1 text-[11px] font-mono-code border transition-colors ${
                      paletteCategoryFilter === cat
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#9AA2B1] hover:text-[#F4F5F7]'
                    }`}
                  >
                    {cat === 'ALL' ? `ALL (${CURATED_PALETTES.length})` : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Palette Grid */}
              <div className="grid grid-cols-2 gap-2">
                {CURATED_PALETTES.filter(p => paletteCategoryFilter === 'ALL' || p.category === paletteCategoryFilter).map((pal) => {
                  const isActivePalette =
                    state.backgroundColor.toLowerCase() === pal.backgroundColor.toLowerCase() &&
                    state.textColor.toLowerCase() === pal.textColor.toLowerCase();
                  return (
                    <button
                      key={pal.id}
                      onClick={() => handleApplyPalette(pal)}
                      className={`p-2.5 text-left border transition-all flex flex-col justify-between gap-2 ${
                        isActivePalette
                          ? 'border-[#00FF66] bg-[#16221C] ring-1 ring-[#00FF66]/40'
                          : 'border-[#22262E] bg-[#0D0F14] hover:border-[#3A4354]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className={`text-xs font-bold truncate ${isActivePalette ? 'text-[#00FF66]' : 'text-[#F4F5F7]'}`}>
                          {pal.name}
                        </span>
                      </div>
                      {/* 4-Color Chip Bar */}
                      <div className="flex items-center h-4 w-full border border-[#2B3342] overflow-hidden">
                        <div className="h-full flex-1" style={{ backgroundColor: pal.backgroundColor }} title={`BG: ${pal.backgroundColor}`} />
                        <div className="h-full flex-1" style={{ backgroundColor: pal.textColor }} title={`Text: ${pal.textColor}`} />
                        <div className="h-full flex-1" style={{ backgroundColor: pal.subTextColor }} title={`Sub: ${pal.subTextColor}`} />
                        <div className="h-full w-4" style={{ backgroundColor: pal.strokeColor }} title={`Stroke: ${pal.strokeColor}`} />
                      </div>
                      <span className="text-[11px] text-[#9AA2B1] line-clamp-1">{pal.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================== GRAPHIC IMAGE LAYER CONTROLLER ==================== */}
            <div className="space-y-3 pt-3 border-t border-[#1E232E]">
              <div className="flex items-center justify-between">
                <label className="text-[#F4F5F7] text-xs font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00FF66]" />
                  <span>GRAPHIC IMAGE LAYER</span>
                </label>
                <button
                  onClick={() => onChange({ showImageLayer: !state.showImageLayer })}
                  className={`px-2.5 py-0.5 text-xs font-bold border transition-colors ${
                    state.showImageLayer
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C]'
                      : 'border-[#22262E] text-[#808898] bg-[#0D0F14]'
                  }`}
                >
                  {state.showImageLayer ? 'PLATE: ACTIVE' : 'PLATE: OFF'}
                </button>
              </div>

              {state.showImageLayer && (
                <div className="p-3.5 bg-[#090B0F] border border-[#232B3B] space-y-3.5">
                  
                  {/* 1. Placement Selector */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C2CAD8] font-semibold">PLACEMENT MODE</span>
                      <span className="text-[#00FF66] font-bold uppercase">{state.imagePlacement}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: 'background', label: 'BACKGROUND' },
                        { id: 'between', label: 'BETWEEN TEXT' },
                        { id: 'above', label: 'ABOVE HEAD' },
                        { id: 'below', label: 'BELOW BODY' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onChange({ imagePlacement: item.id as any })}
                          className={`py-1.5 px-1 text-center text-xs border font-mono-code transition-colors ${
                            state.imagePlacement === item.id
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Studio Plates Library Preset Chips (18 Plates) */}
                  <div className="space-y-2 pt-1 border-t border-[#181D26]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#C2CAD8] text-xs font-semibold block">
                        STUDIO SPECIMEN PLATES ({STUDIO_PLATES.length})
                      </span>
                      <button
                        onClick={() => {
                          const pick = STUDIO_PLATES[Math.floor(Math.random() * STUDIO_PLATES.length)];
                          onChange({
                            imageUrl: pick.url,
                            imageCaption: pick.caption,
                            showImageLayer: true,
                          });
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 text-[11px] font-bold"
                        title="Randomize studio specimen plate"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>SHUFFLE PLATE</span>
                      </button>
                    </div>

                    {/* Plate Category Filter */}
                    <div className="flex flex-wrap gap-1">
                      {['ALL', 'Photographic', 'Swiss Construct', 'Technical / Radar', 'Op-Art & Kinetic'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPlateCategoryFilter(cat)}
                          className={`px-2 py-0.5 text-[11px] font-mono-code border transition-colors ${
                            plateCategoryFilter === cat
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#9AA2B1] hover:text-[#F4F5F7]'
                          }`}
                        >
                          {cat === 'ALL' ? `ALL (${STUDIO_PLATES.length})` : cat.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-0.5">
                      {STUDIO_PLATES.filter(p => plateCategoryFilter === 'ALL' || p.category === plateCategoryFilter).map((plate) => (
                        <button
                          key={plate.id}
                          onClick={() => onChange({ imageUrl: plate.url, imageCaption: plate.caption, showImageLayer: true })}
                          className={`p-1.5 text-left text-xs border transition-colors flex flex-col justify-between ${
                            state.imageUrl === plate.url
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#A1A1AA] hover:text-[#F4F5F7]'
                          }`}
                        >
                          <div className="w-full h-10 mb-1 overflow-hidden border border-[#222834] bg-[#070809]">
                            <img src={plate.url} alt={plate.label} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate font-bold text-[11px]">{plate.label}</span>
                            {state.imageUrl === plate.url && <span className="text-[#00FF66] text-xs shrink-0">✓</span>}
                          </div>
                          <span className="text-[10px] text-[#808898] truncate">{plate.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Custom File Upload & URL input */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#808898] text-xs font-semibold">CUSTOM IMAGE SOURCE</span>
                      <label className="cursor-pointer text-xs text-[#00FF66] hover:text-[#4DFF95] underline font-bold">
                        <span>[UPLOAD FILE]</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                if (dataUrl) {
                                  onChange({ imageUrl: dataUrl, showImageLayer: true });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={state.imageUrl.startsWith('data:') ? '[Uploaded Local Image Plate]' : state.imageUrl}
                      onChange={(e) => {
                        if (!e.target.value.startsWith('[Uploaded Local Image Plate]')) {
                          onChange({ imageUrl: e.target.value });
                        }
                      }}
                      placeholder="Enter image URL or select from studio plates..."
                      className="w-full bg-[#11141A] border border-[#222834] px-2.5 py-1.5 text-xs text-[#F4F5F7] font-mono-code focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  {/* 4. Height (Inline mode) or Fit (Background mode) */}
                  {state.imagePlacement !== 'background' ? (
                    <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#808898]">INLINE PLATE HEIGHT</span>
                        <span className="text-[#00FF66] font-bold">{state.imageHeight || 200}px</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="360"
                        step="10"
                        value={state.imageHeight || 200}
                        onChange={(e) => onChange({ imageHeight: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                      <span className="text-[#808898] text-xs block">BACKGROUND FIT</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'cover', label: 'COVER (FILL CANVAS)' },
                          { id: 'contain', label: 'CONTAIN (FIT WHOLE)' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => onChange({ imageFit: f.id as any })}
                            className={`py-1 text-center text-xs border font-mono-code ${
                              (state.imageFit ?? 'cover') === f.id
                                ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                                : 'border-[#1E2430] bg-[#11141A] text-[#808898]'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Opacity & Blend Mode */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#181D26]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#808898]">OPACITY</span>
                        <span className="text-[#00FF66] font-bold">{Math.round((state.imageOpacity ?? 0.85) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.10"
                        max="1.00"
                        step="0.05"
                        value={state.imageOpacity ?? 0.85}
                        onChange={(e) => onChange({ imageOpacity: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[#808898] text-xs block">BLEND MODE</span>
                      <select
                        value={state.imageBlendMode || 'normal'}
                        onChange={(e) => onChange({ imageBlendMode: e.target.value as TypographicState['imageBlendMode'] })}
                        className="w-full bg-[#11141A] border border-[#222834] px-2 py-1 text-xs text-[#F4F5F7] font-mono-code focus:outline-none focus:border-[#00FF66]"
                      >
                        <option value="normal">Normal</option>
                        <option value="multiply">Multiply</option>
                        <option value="screen">Screen</option>
                        <option value="overlay">Overlay</option>
                        <option value="luminosity">Luminosity</option>
                      </select>
                    </div>
                  </div>

                  {/* 6. Visual Filter */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#808898]">IMAGE FILTER</span>
                      <span className="text-[#00FF66] font-bold uppercase">{state.imageFilter || 'none'}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { id: 'none', label: 'NORMAL' },
                        { id: 'grayscale', label: 'MONO' },
                        { id: 'high-contrast', label: 'HI-CON' },
                        { id: 'duotone', label: 'DUOTONE' },
                        { id: 'invert', label: 'INVERT' },
                      ].map((flt) => (
                        <button
                          key={flt.id}
                          onClick={() => onChange({ imageFilter: flt.id as TypographicState['imageFilter'] })}
                          className={`py-1 text-center text-[10px] font-mono-code border transition-colors ${
                            (state.imageFilter || 'none') === flt.id
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {flt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. Plate Caption */}
                  <div className="space-y-1 pt-1 border-t border-[#181D26]">
                    <span className="text-[#808898] text-xs block">PLATE CAPTION LABEL</span>
                    <input
                      type="text"
                      value={state.imageCaption || ''}
                      onChange={(e) => onChange({ imageCaption: e.target.value })}
                      placeholder="e.g. Fig. 11 // Structural Matrix"
                      className="w-full bg-[#11141A] border border-[#222834] px-2.5 py-1.5 text-xs text-[#F4F5F7] font-mono-code focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                </div>
              )}
            </div>

            {/* Background Texture Selection & Texture Modifier Lab */}
            <div className="space-y-3 pt-2 border-t border-[#1E232E]">
              <div className="flex items-center justify-between">
                <label className="text-[#F4F5F7] text-xs font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00FF66]" />
                  <span>ORIGINAL GRAPHIC TEXTURES (40)</span>
                </label>
                <span className="text-xs px-2 py-0.5 bg-[#171C26] text-[#00FF66] font-mono-code font-bold">
                  {state.backgroundTexture !== 'none' ? state.backgroundTexture.toUpperCase() : 'OFF'}
                </span>
              </div>

              {/* Texture Category Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {['ALL', 'PHOTO', 'VECTOR', 'PRINT', 'DIGITAL', 'TACTILE'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTextureCategoryFilter(cat)}
                    className={`px-2 py-1 text-[11px] font-mono-code border transition-colors ${
                      textureCategoryFilter === cat
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#9AA2B1] hover:text-[#F4F5F7]'
                    }`}
                  >
                    {cat === 'PHOTO' ? 'PHOTO PLATES (14)' : cat}
                  </button>
                ))}
              </div>

              {/* Texture Selection Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'SOLID CANVAS', desc: 'Minimal stark Swiss poster ground', category: 'SOLID', thumb: '' },
                  { id: 'macro-ink', label: 'MACRO INK BLEED', desc: 'Lithographic capillary paper bleed', category: 'PHOTO', thumb: '/images/macro-ink-interference-plate.jpg' },
                  { id: 'ferrofluid-bloom', label: 'FERROFLUID BLOOM', desc: 'Dendritic sumi ink & magnetic spikes', category: 'PHOTO', thumb: '/images/ferrofluid-ink-bloom.jpg' },
                  { id: 'oxidized-etching', label: 'INK & LINEN FIBERS', desc: 'Iridescent ink in raw hemp fibers', category: 'PHOTO', thumb: '/images/oxidized-etching-plate.jpg' },
                  { id: 'suminagashi-ink', label: 'SUMINAGASHI MARBLE', desc: 'Floating sumi ink fluid waves', category: 'PHOTO', thumb: '/images/suminagashi-marble-ink.jpg' },
                  { id: 'crumpled-paper', label: 'CRUMPLED KRAFT', desc: 'Folded editorial paper creases & cracks', category: 'PHOTO', thumb: '/images/crumpled-paper-plate.jpg' },
                  { id: 'wheatpaste-fold', label: 'FOLDED WHEATPASTE', desc: 'Weathered street poster creases & deckle', category: 'PHOTO', thumb: '/images/folded-wheatpaste-poster.jpg' },
                  { id: 'kraft-collage', label: 'TORN KRAFT COLLAGE', desc: 'Sculptural charcoal & kraft paper relief', category: 'PHOTO', thumb: '/images/torn-kraft-collage.jpg' },
                  { id: 'swiss-grid', label: 'SWISS BRUTALIST', desc: 'Monolithic concrete shadow study', category: 'PHOTO', thumb: '/images/swiss-grid-abstract-geometry.jpg' },
                  { id: 'brutalist-vault', label: 'BRUTALIST VAULT', desc: 'Cantilevered concrete & alpine light shaft', category: 'PHOTO', thumb: '/images/brutalist-concrete-vault.jpg' },
                  { id: 'brutalist-facade', label: 'CONSTRUCTIVIST FACADE', desc: 'Double-exposure concrete monolith grid', category: 'PHOTO', thumb: '/images/swiss-brutalist-facade.jpg' },
                  { id: 'darkroom', label: 'DARKROOM PHOTOGRAM', desc: 'Laser caustics, focal lens & optics', category: 'PHOTO', thumb: '/images/type-lab-darkroom-texture.jpg' },
                  { id: 'celluloid-burn', label: 'CELLULOID FILM BURN', desc: '35mm developer emulsion burn & flare', category: 'PHOTO', thumb: '/images/celluloid-film-burn.jpg' },
                  { id: 'photostat', label: 'PHOTOSTAT GRAIN', desc: '1960s electrostatic toner dust dispersion', category: 'PHOTO', thumb: '/images/photostat-grain-plate.jpg' },
                  { id: 'risograph', label: 'RISOGRAPH HALFTONE', desc: 'Macro dual-drum screen mesh & ink gain', category: 'PHOTO', thumb: '/images/risograph-halftone-mesh.jpg' },
                  { id: 'marbled-ink', label: 'VECTOR SUMINAGASHI', desc: 'Fluid turbulence & organic marbled trails', category: 'PRINT', thumb: '' },
                  { id: 'distressed-xerox', label: 'DISTRESSED XEROX', desc: 'High-contrast photocopier toner abrasion', category: 'PRINT', thumb: '' },
                  { id: 'glitch-matrix', label: 'GLITCH RGB MATRIX', desc: 'Chromatic channel split & digital artifact', category: 'DIGITAL', thumb: '' },
                  { id: 'woodcut-hatch', label: 'WOODCUT CROSSHATCH', desc: 'Linocut relief hatching & woodblock bite', category: 'PRINT', thumb: '' },
                  { id: 'thermal-fax', label: 'THERMAL RECEIPT FAX', desc: 'Micro dot-matrix thermal print line raster', category: 'PRINT', thumb: '' },
                  { id: 'halftone-dots', label: 'VECTOR HALFTONE', desc: 'Procedural geometric dot raster matrix', category: 'VECTOR', thumb: '' },
                  { id: 'cyber-scanline', label: 'CRT SCANLINES', desc: 'Phosphor cathode ray line interference', category: 'DIGITAL', thumb: '' },
                  { id: 'blueprint-grid', label: 'BLUEPRINT MATRIX', desc: 'Drafting coordinate grid with marks', category: 'VECTOR', thumb: '' },
                  { id: 'film-grain', label: 'FILM ISO NOISE', desc: 'Silver halide micro-emulsion noise', category: 'PRINT', thumb: '' },
                  { id: 'topo-contour', label: 'TOPOGRAPHIC ISOLINE', desc: 'Cartographic elevation contour vectors', category: 'VECTOR', thumb: '' },
                  { id: 'microfiche-grid', label: 'MICROFICHE ARCHIVE', desc: 'Optical calibration ticks & index frame', category: 'VECTOR', thumb: '' },
                  { id: 'ascii-matrix', label: 'BINARY PUNCH MATRIX', desc: 'Mainframe punch-card perforated grid', category: 'DIGITAL', thumb: '' },
                  { id: 'linen-weave', label: 'BOOKBINDER LINEN', desc: 'Fine cross-woven archival cloth texture', category: 'TACTILE', thumb: '' },
                  { id: 'carbon-fiber', label: 'CARBON TWILL WEAVE', desc: 'High-density diagonal industrial weave', category: 'TACTILE', thumb: '' },
                  { id: 'moire-wave', label: 'OPTICAL MOIRÉ WAVE', desc: 'Concentric op-art interference harmonics', category: 'VECTOR', thumb: '' },
                  { id: 'terrazzo-stone', label: 'TERRAZZO AGGREGATE', desc: 'Brutalist mineral stone chip speckle', category: 'TACTILE', thumb: '' },
                  { id: 'bauhaus-grid', label: 'BAUHAUS GEOMETRIC', desc: 'Modular nested circles & diagonals', category: 'VECTOR', thumb: '' },
                  { id: 'letterpress-bite', label: 'LETTERPRESS COTTON', desc: 'Archival cotton pulp & ink impression', category: 'PRINT', thumb: '' },
                  { id: 'newsprint-halftone', label: 'NEWSPRINT GRAVURE', desc: '1970s tabloid 45° halftone screen', category: 'PRINT', thumb: '' },
                  { id: 'architectural-draft', label: 'AXONOMETRIC DRAFT', desc: '30°/60° isometric drafting grid', category: 'VECTOR', thumb: '' },
                  { id: 'oscilloscope-harmonic', label: 'LISSAJOUS HARMONIC', desc: 'Phase-locked sinusoidal wave curves', category: 'VECTOR', thumb: '' },
                  { id: 'concrete-formwork', label: 'SHUTTERED CONCRETE', desc: 'Board-formed brutalist tie-rod grain', category: 'TACTILE', thumb: '' },
                  { id: 'vhs-tracking', label: 'MAGNETIC TAPE NOISE', desc: 'Helical-scan analog dropout bands', category: 'DIGITAL', thumb: '' },
                  { id: 'japanese-washi', label: 'KOZO WASHI PAPER', desc: 'Organic mulberry deckle fiber weave', category: 'TACTILE', thumb: '' },
                  { id: 'swiss-cross-matrix', label: 'HELVETIC PLUS GRID', desc: 'Precision Swiss micro-plus registration', category: 'VECTOR', thumb: '' },
                ].filter(item => textureCategoryFilter === 'ALL' || item.id === 'none' || item.category === textureCategoryFilter).map((item) => {
                  const isSelected = state.backgroundTexture === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChange({
                          backgroundTexture: item.id as any,
                          textureOpacity: (state.textureOpacity && state.textureOpacity >= 0.35) ? state.textureOpacity : 0.45,
                          textureBlendMode: state.textureBlendMode || 'overlay',
                        });
                      }}
                      className={`p-2 text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                          : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7] hover:border-[#3A4354]'
                      }`}
                    >
                      {item.thumb && (
                        <div className="w-full h-11 mb-1.5 overflow-hidden border border-[#222834] bg-[#070809]">
                          <img src={item.thumb} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                        <span className={`text-[10px] px-1 py-0.5 rounded font-mono-code shrink-0 ${
                          isSelected ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'bg-[#181D26] text-[#A1A1AA]'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A1A1AA] mt-0.5 line-clamp-1">{item.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* ==================== TEXTURE MODIFIER LAB ==================== */}
              {state.backgroundTexture !== 'none' && (
                <div className="p-3.5 sm:p-4 bg-[#090B0F] border border-[#232B3B] space-y-4">
                  {/* Lab Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#1A1F2B]">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span className="text-xs font-bold text-[#F4F5F7] tracking-wider uppercase">
                        TEXTURE MODIFIERS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShuffleTextureModifiers}
                        className="flex items-center gap-1 text-[11px] text-[#00FF66] hover:text-[#4DFF95] bg-[#142319] hover:bg-[#1E3627] px-2 py-0.5 border border-[#00FF66]/40 font-bold transition-colors"
                        title="Randomize texture parameters"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>SHUFFLE</span>
                      </button>
                      <button
                        onClick={handleResetTextureModifiers}
                        className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-[#F4F5F7] bg-[#151922] hover:bg-[#1E232E] px-2 py-0.5 border border-[#22262E] transition-colors"
                        title="Reset texture parameters to default"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>RESET</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. OPACITY / DENSITY SLIDER */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C2CAD8] font-semibold">OPACITY (DENSITY)</span>
                      <span className="text-[#00FF66] font-bold">{Math.round((state.textureOpacity ?? 0.45) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.00"
                      step="0.01"
                      value={state.textureOpacity ?? 0.45}
                      onChange={(e) => onChange({ textureOpacity: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex gap-1.5 pt-0.5">
                      {[0.15, 0.35, 0.55, 0.80, 1.0].map((val) => (
                        <button
                          key={val}
                          onClick={() => onChange({ textureOpacity: val })}
                          className={`flex-1 py-0.5 text-xs border transition-colors ${
                            Math.abs((state.textureOpacity ?? 0.45) - val) < 0.04
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {Math.round(val * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. BLEND MODE PICKER */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C2CAD8] font-semibold">BLEND MODE</span>
                      <span className="text-[#00FF66] font-bold uppercase">{state.textureBlendMode ?? 'overlay'}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'overlay', label: 'OVERLAY' },
                        { id: 'screen', label: 'SCREEN' },
                        { id: 'multiply', label: 'MULTIPLY' },
                        { id: 'hard-light', label: 'HARD-LT' },
                        { id: 'soft-light', label: 'SOFT-LT' },
                        { id: 'difference', label: 'DIFFER' },
                        { id: 'color-dodge', label: 'DODGE' },
                        { id: 'normal', label: 'NORMAL' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => onChange({ textureBlendMode: mode.id as any })}
                          className={`py-1 px-1 text-center text-xs font-mono-code border transition-colors ${
                            (state.textureBlendMode ?? 'overlay') === mode.id
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. SCALE / GRAIN MAGNIFICATION */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C2CAD8] font-semibold">SCALE / ZOOM</span>
                      <span className="text-[#00FF66] font-bold">{state.textureScale ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="250"
                      step="5"
                      value={state.textureScale ?? 100}
                      onChange={(e) => onChange({ textureScale: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex gap-1.5 pt-0.5">
                      {[75, 100, 150, 200].map((s) => (
                        <button
                          key={s}
                          onClick={() => onChange({ textureScale: s })}
                          className={`flex-1 py-0.5 text-xs border transition-colors ${
                            (state.textureScale ?? 100) === s
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. CONTRAST & BRIGHTNESS CONTROLS */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#181D26]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#808898]">CONTRAST</span>
                        <span className="text-[#00FF66] font-bold text-[11px]">{state.textureContrast ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        step="5"
                        value={state.textureContrast ?? 100}
                        onChange={(e) => onChange({ textureContrast: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#808898]">BRIGHTNESS</span>
                        <span className="text-[#00FF66] font-bold text-[11px]">{state.textureBrightness ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="200"
                        step="5"
                        value={state.textureBrightness ?? 100}
                        onChange={(e) => onChange({ textureBrightness: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* 5. DIFFUSION & LUMINANCE POLARITY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#181D26]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#808898]">DIFFUSION (BLUR)</span>
                        <span className="text-[#00FF66] font-bold text-[11px]">{state.textureBlur ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        step="1"
                        value={state.textureBlur ?? 0}
                        onChange={(e) => onChange({ textureBlur: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[#808898] text-xs block">LUMINANCE POLARITY</span>
                      <button
                        onClick={() => onChange({ textureInvert: !state.textureInvert })}
                        className={`w-full py-1 px-2 text-center text-xs border transition-colors ${
                          state.textureInvert
                            ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                            : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                        }`}
                      >
                        {state.textureInvert ? 'NEGATIVE [INVERTED]' : 'POSITIVE [NATURAL]'}
                      </button>
                    </div>
                  </div>

                  {/* 6. DUOTONE PROCESS TINT */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C2CAD8] font-semibold">DUOTONE PROCESS TINT (10)</span>
                      <span className="text-[#00FF66] font-bold uppercase">{state.textureTint ?? 'none'}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'none', label: 'OFF', color: '#333B4A' },
                        { id: 'green', label: 'GREEN', color: '#00FF66' },
                        { id: 'amber', label: 'AMBER', color: '#FFB800' },
                        { id: 'cyan', label: 'CYAN', color: '#00E5FF' },
                        { id: 'crimson', label: 'RED', color: '#FF3366' },
                        { id: 'violet', label: 'VIOLET', color: '#8B5CF6' },
                        { id: 'cobalt', label: 'COBALT', color: '#0051FF' },
                        { id: 'acid-lime', label: 'LIME', color: '#CCFF00' },
                        { id: 'copper', label: 'COPPER', color: '#EA580C' },
                        { id: 'monochrome', label: 'B&W', color: '#FFFFFF' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onChange({ textureTint: t.id as any })}
                          className={`py-1 flex flex-col items-center justify-center gap-1 border transition-colors ${
                            (state.textureTint ?? 'none') === t.id
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-none border border-black/40"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="text-[11px] font-bold uppercase">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. TILING & FIT MODE */}
                  <div className="space-y-1.5 pt-1 border-t border-[#181D26]">
                    <span className="text-[#808898] text-xs font-semibold block">TILING & FIT MODE</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'cover', label: 'COVER (FILL)' },
                        { id: 'repeat', label: 'TILE REPEAT' },
                        { id: 'contain', label: 'CONTAIN (FIT)' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => onChange({ textureRepeat: r.id as any })}
                          className={`py-1 text-center text-xs font-mono-code border transition-colors ${
                            (state.textureRepeat ?? 'cover') === r.id
                              ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66] font-bold'
                              : 'border-[#1E2430] bg-[#11141A] text-[#808898] hover:text-[#C2CAD8]'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Overlay Controls */}
            <div className="space-y-2 pt-2 border-t border-[#1E232E]">
              <div className="flex justify-between items-center">
                <span className="text-[#A1A1AA] text-xs font-semibold flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#00FF66]" />
                  INSPECTION GRID GUIDES (BACKGROUND)
                </span>
                <button
                  onClick={() => onChange({ showGrid: !state.showGrid })}
                  className={`px-3 py-1 text-xs border ${
                    state.showGrid
                      ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C] font-bold'
                      : 'border-[#22262E] text-[#A1A1AA]'
                  }`}
                >
                  {state.showGrid ? 'OVERLAY: ON' : 'OVERLAY: OFF'}
                </button>
              </div>

              {state.showGrid && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                  {(['modular', 'baseline', 'crosshair', 'golden-ratio', 'diagonal'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => onChange({ gridType: type })}
                      className={`p-2 text-center text-xs uppercase border transition-colors truncate ${
                        state.gridType === type
                          ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C] font-bold'
                          : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA]'
                      }`}
                    >
                      {type === 'golden-ratio' ? 'GOLDEN' : type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-3 pt-3 border-t border-[#1E232E]">
              <span className="text-[#A1A1AA] block text-xs font-semibold">
                COMPLETE HISTORICAL PRESETS ({SPECIMEN_PRESETS.length})
              </span>
              <div className="space-y-2">
                {SPECIMEN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onChange(preset.state)}
                    className="w-full text-left p-3 border border-[#22262E] bg-[#0D0F14] hover:bg-[#151922] hover:border-[#00FF66] transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F4F5F7] text-xs group-hover:text-[#00FF66] transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 bg-[#1A1F29] text-[#00FF66] font-mono-code font-bold">
                        {preset.code}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Dock Bottom Action Bar */}
      <div className="p-3 sm:p-5 border-t border-[#22262E] bg-[#0A0C10] flex items-center justify-between gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-[#C2CAD8] hover:text-[#F4F5F7] bg-[#111317] hover:bg-[#1B202A] border border-[#22262E] transition-colors text-xs font-bold shrink-0"
          title="Reset All Parameters to Default (Shortcut: Esc)"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>RESET</span>
        </button>

        {onViewArtboard && (
          <button
            onClick={onViewArtboard}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-[#070809] bg-[#00FF66] hover:bg-[#4DFF95] font-bold text-xs shrink-0"
            title="View Artboard on Mobile"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW POSTER</span>
          </button>
        )}

        <button
          onClick={handleCopyCSS}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-[#00FF66] bg-[#141F18] hover:bg-[#1A2E20] border border-[#00FF66]/50 transition-colors font-bold text-xs"
          title="Copy CSS rules for this composition"
        >
          {copiedCSS ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">COPY CSS</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Font Picker Modal Dialog */}
      <VisualFontPicker
        isOpen={fontPickerTarget !== null}
        onClose={() => setFontPickerTarget(null)}
        title={fontPickerTarget === 'headline' ? 'SELECT HEADLINE TYPEFACE' : 'SELECT SECONDARY PAIRING TYPEFACE'}
        selectedFontFamily={fontPickerTarget === 'headline' ? state.fontFamily : state.subFontFamily}
        onSelectFont={(font) => {
          if (fontPickerTarget === 'headline') {
            onChange({ fontFamily: font.cssFamily });
          } else {
            onChange({ subFontFamily: font.cssFamily });
          }
        }}
        fonts={allFonts}
        onUploadCustomFont={onUploadCustomFont}
      />

    </div>
  );
};
