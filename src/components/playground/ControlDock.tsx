import React, { useState } from 'react';
import type { TypographicState, FontDefinition, FontPairing } from '../../types';
import { AVAILABLE_FONTS } from '../../data/fonts';
import { SPECIMEN_PRESETS } from '../../data/presets';
import { CURATED_PAIRINGS } from '../../data/pairings';
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
  ChevronRight
} from 'lucide-react';

interface ControlDockProps {
  state: TypographicState;
  onChange: (updates: Partial<TypographicState>) => void;
  onReset: () => void;
  backgroundTexture: 'none' | 'darkroom' | 'swiss-grid' | 'macro-ink';
  onChangeBackgroundTexture: (texture: 'none' | 'darkroom' | 'swiss-grid' | 'macro-ink') => void;
  onCopyCSS: () => void;
  onAutoFitSize: () => void;
  customFonts: FontDefinition[];
  onUploadCustomFont: (font: FontDefinition) => void;
  activeLayer?: 'headline' | 'secondary';
  onSelectLayer?: (layer: 'headline' | 'secondary') => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  state,
  onChange,
  onReset,
  backgroundTexture,
  onChangeBackgroundTexture,
  onCopyCSS,
  onAutoFitSize,
  customFonts,
  onUploadCustomFont,
  activeLayer: externalActiveLayer,
  onSelectLayer,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'type' | 'pairings' | 'effects' | 'canvas'>('type');
  const [internalActiveLayer, setInternalActiveLayer] = useState<'headline' | 'secondary'>('headline');
  const [fontPickerTarget, setFontPickerTarget] = useState<'headline' | 'secondary' | null>(null);
  const [copiedCSS, setCopiedCSS] = useState(false);

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
    "Internationale Zeitschrift für Graphische Kunst und verwandte Gebiete.",
    "Order is the prerequisite of optical clarity across architectural grids.",
    "A dialogue between Enlightenment Didone hairline brackets and grotesque vectors.",
    "Telemetry coordinates locked. Optical vectors stabilized across all axes."
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

  return (
    <div className="w-full bg-[#111317] border-t lg:border-t-0 lg:border-l border-[#22262E] text-xs font-mono-code flex flex-col">
      
      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-[#22262E] bg-[#0A0C10] px-3 py-1 gap-1 overflow-x-auto">
        {[
          { id: 'type', label: '01 TYPE & PAIRING', icon: Type },
          { id: 'pairings', label: '02 PAIRINGS GALLERY', icon: Columns },
          { id: 'effects', label: '03 EFFECTS & MOTION', icon: Sliders },
          { id: 'canvas', label: '04 CANVAS & PRESETS', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`px-3 py-2.5 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-[#00FF66] text-[#00FF66] bg-[#151922]'
                  : 'border-transparent text-[#9AA2B1] hover:text-[#F4F5F7] hover:bg-[#111317]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Control Panel Body */}
      <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[700px] flex-1">

        {/* ==================== TAB 1: TYPE & PAIRING DUAL-LAYER CONTROLLER ==================== */}
        {activeMainTab === 'type' && (
          <div className="space-y-5">
            
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
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                    state.showSubText ? 'bg-[#00FF66] text-black' : 'bg-[#22262E] text-[#71717A]'
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
                    <span className="text-xs text-[#A1A1AA]">{state.text.length} Chars</span>
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
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[#A1A1AA] text-xs font-semibold">HEADLINE COLOR</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.textColor}
                        onChange={(e) => onChange({ textColor: e.target.value })}
                        className="w-7 h-7 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                      />
                      <div className="flex gap-1.5">
                        {['#F4F5F7', '#00FF66', '#FFB800', '#00E5FF', '#070809'].map((hex) => (
                          <button
                            key={hex}
                            onClick={() => onChange({ textColor: hex })}
                            className="w-6 h-6 border border-[#2B3342] hover:scale-110 transition-transform"
                            style={{ backgroundColor: hex }}
                            title={hex}
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

                {/* Secondary Text Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="font-semibold text-[#F4F5F7] flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#00FF66]"></span>
                      SECONDARY PAIRING TEXT
                    </span>
                    <span className="text-xs text-[#A1A1AA]">{state.subText.length} Chars</span>
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
                        className="w-7 h-7 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                      />
                      <div className="flex gap-1">
                        {['#00FF66', '#F4F5F7', '#FFB800', '#00E5FF', '#A1A1AA'].map((hex) => (
                          <button
                            key={hex}
                            onClick={() => onChange({ subTextColor: hex })}
                            className="w-5 h-5 border border-[#2B3342] hover:scale-110 transition-transform"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: PAIRINGS GALLERY ==================== */}
        {activeMainTab === 'pairings' && (
          <div className="space-y-4">
            
            {/* Header with Shuffle */}
            <div className="flex items-center justify-between p-3 bg-[#0D0F14] border border-[#22262E]">
              <div>
                <span className="font-bold text-[#F4F5F7] block text-xs">STUDIO PAIRING ENGINE</span>
                <span className="text-[11px] text-[#A1A1AA]">12 curated historical & contemporary duos</span>
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

            {/* Curated Pairing Cards */}
            <div className="space-y-3">
              {CURATED_PAIRINGS.map((pairing) => (
                <div
                  key={pairing.id}
                  className="p-4 border border-[#22262E] bg-[#0A0C10] hover:border-[#00FF66] transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#F4F5F7] text-xs group-hover:text-[#00FF66] transition-colors">
                        {pairing.name}
                      </span>
                      <span className="text-[11px] text-[#71717A] block mt-0.5">{pairing.category}</span>
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

                  <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                    <span>{pairing.headlineFamily.split(',')[0].replace(/['"]/g, '')} + {pairing.bodyFamily.split(',')[0].replace(/['"]/g, '')}</span>
                    <span className="text-[#A1A1AA] line-clamp-1 max-w-[200px]">{pairing.description}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 3: EFFECTS & WATERMARK ==================== */}
        {activeMainTab === 'effects' && (
          <div className="space-y-5">
            
            {/* Kinetic Animation Modes */}
            <div className="space-y-2">
              <label className="text-[#A1A1AA] block text-xs font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00FF66]" />
                KINETIC MOTION ENGINE
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'none', label: 'STATIC STATE' },
                  { id: 'marquee', label: 'KINETIC MARQUEE' },
                  { id: 'breath', label: 'VARIABLE BREATH' },
                  { id: 'skew-wobble', label: 'SKEW OSCILLATION' },
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
                      {['57', '11', 'R', 'SPQR', '✦', '№'].map((txt) => (
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

        {/* ==================== TAB 4: CANVAS & PRESETS ==================== */}
        {activeMainTab === 'canvas' && (
          <div className="space-y-5">
            
            {/* Quick Invert button */}
            <button
              onClick={handleInvertColors}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#161B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#272F3E] transition-colors font-bold"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#00FF66]" />
              <span>INVERT FOREGROUND ⇄ BACKGROUND</span>
            </button>

            {/* Canvas Aspect Ratio Framing */}
            <div className="space-y-2">
              <label className="text-[#A1A1AA] block text-xs font-semibold">
                CANVAS PROPORTIONS & RATIO
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'poster', label: 'A4 (1:1.41)' },
                  { id: 'square', label: 'SQUARE (1:1)' },
                  { id: 'ribbon', label: 'RIBBON (21:9)' },
                  { id: 'editorial', label: 'EDITORIAL (4:5)' },
                  { id: 'fluid', label: 'FLUID RESPONSIVE' },
                ].map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => onChange({ canvasFrame: frame.id as any })}
                    className={`p-2 text-center text-xs border transition-colors ${
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
            <div className="space-y-2 pt-2 border-t border-[#1E232E]">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>BACKGROUND COLOR</span>
                <span className="text-[#00FF66] font-bold uppercase">{state.backgroundColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-8 h-8 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {[
                    { hex: '#070809', label: 'Pitch Obsidian' },
                    { hex: '#111317', label: 'Deep Monolith' },
                    { hex: '#F4F5F7', label: 'Laboratory White' },
                    { hex: '#00FF66', label: 'Electric Strobe' },
                    { hex: '#1E232B', label: 'Graphite Zinc' },
                  ].map((item) => (
                    <button
                      key={item.hex}
                      onClick={() => onChange({ backgroundColor: item.hex })}
                      className="w-6 h-6 border border-[#2B3342] relative hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.hex }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background Texture Selection */}
            <div className="space-y-2 pt-2 border-t border-[#1E232E]">
              <label className="text-[#A1A1AA] block text-xs font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00FF66]" />
                ORIGINAL GRAPHIC TEXTURES
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'SOLID COLOR', desc: 'Minimal Swiss stark canvas' },
                  { id: 'darkroom', label: 'DARKROOM PHOTOGRAM', desc: 'Laser caustics & film grain' },
                  { id: 'swiss-grid', label: 'BRUTALIST CONCRETE', desc: 'Architectural shadow planes' },
                  { id: 'macro-ink', label: 'MACRO INK EMULSION', desc: 'Lithographic paper bleed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChangeBackgroundTexture(item.id as any)}
                    className={`p-2.5 text-left border transition-all ${
                      backgroundTexture === item.id
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-[#A1A1AA] mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
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
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(['modular', 'baseline', 'crosshair'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => onChange({ gridType: type })}
                      className={`p-2 text-center text-xs uppercase border transition-colors ${
                        state.gridType === type
                          ? 'border-[#00FF66] text-[#00FF66] bg-[#16221C] font-bold'
                          : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-3 pt-3 border-t border-[#1E232E]">
              <span className="text-[#A1A1AA] block text-xs font-semibold">
                COMPLETE HISTORICAL PRESETS (08)
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
      <div className="p-4 sm:p-5 border-t border-[#22262E] bg-[#0A0C10] flex items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 text-[#C2CAD8] hover:text-[#F4F5F7] bg-[#111317] hover:bg-[#1B202A] border border-[#22262E] transition-colors text-xs font-bold"
          title="Reset All Parameters to Default (Shortcut: Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET</span>
        </button>

        <button
          onClick={handleCopyCSS}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[#00FF66] bg-[#141F18] hover:bg-[#1A2E20] border border-[#00FF66]/50 transition-colors font-bold text-xs"
          title="Copy CSS rules for this composition"
        >
          {copiedCSS ? (
            <>
              <Check className="w-4 h-4" />
              <span>COPIED CSS RULES!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>COPY CSS RULES</span>
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
