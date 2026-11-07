import React, { useState, useRef } from 'react';
import type { TypographicState, FontDefinition } from '../../types';
import { AVAILABLE_FONTS } from '../../data/fonts';
import { SPECIMEN_PRESETS } from '../../data/presets';
import { CURATED_PAIRINGS } from '../../data/pairings';
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
  Sparkles,
  ArrowRightLeft,
  Image as ImageIcon,
  Copy,
  Check,
  Upload,
  Columns
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
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'pairings' | 'layout' | 'color' | 'presets'>('type');
  const [fontCategoryFilter, setFontCategoryFilter] = useState<string>('all');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allFonts = [...AVAILABLE_FONTS, ...customFonts];

  const filteredFonts = fontCategoryFilter === 'all'
    ? allFonts
    : allFonts.filter(f => f.category === fontCategoryFilter);

  const samplePhrases = [
    "FORM FOLLOWS FUNCTION FOLLOWS FORM",
    "DIE NEUE GRAPHIK // ZÜRICH 1957",
    "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    "KINETIC SYNAPSE VOL. 11",
    "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "CONSTRUCTIVE DECONSTRUCTION OF THE LETTERFORM",
    "HYDROGEN LINE 1420.40575 MHz [LOCKED]"
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9 ]/g, ' ');
      const cssFontFamily = `'${fontName}', sans-serif`;

      const fontFace = new FontFace(fontName, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);

      const newFont: FontDefinition = {
        id: `custom-${Date.now()}`,
        name: fontName,
        cssFamily: cssFontFamily,
        category: 'custom',
        weights: [400, 700],
        origin: 'User Local File',
        designer: 'Custom Upload',
        bestUse: 'Custom Typographic Testing',
        sampleText: 'CUSTOM LOADED TYPEFACE'
      };

      onUploadCustomFont(newFont);
      onChange({ fontFamily: cssFontFamily });
    } catch (err) {
      console.error('Failed to load custom font file', err);
      alert('Could not parse font file. Please provide a valid .ttf, .otf, or .woff file.');
    }
  };

  return (
    <div className="w-full bg-[#111317] border-t lg:border-t-0 lg:border-l border-[#22262E] text-xs font-mono-code flex flex-col">
      
      {/* Control Tabs Header */}
      <div className="flex border-b border-[#22262E] bg-[#0A0C10] px-3 py-1 gap-1 overflow-x-auto">
        {[
          { id: 'type', label: 'AXES & TYPE', icon: Type },
          { id: 'pairings', label: 'PAIRINGS', icon: Columns },
          { id: 'layout', label: 'TRANSFORMS', icon: Sliders },
          { id: 'color', label: 'ATMOSPHERE', icon: Palette },
          { id: 'presets', label: 'PRESETS', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

        {/* 1. TEXT INPUT & PHRASE BANK (Always visible at top for immediate workflow) */}
        <div className="space-y-2.5 pb-4 border-b border-[#1E232E]">
          <div className="flex items-center justify-between text-[#A1A1AA]">
            <span className="font-semibold text-[#F4F5F7] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00FF66]"></span>
              HEADLINE TEXT INPUT
            </span>
            <span className="text-xs text-[#A1A1AA]">{state.text.length} Chars</span>
          </div>
          
          <textarea
            value={state.text}
            onChange={(e) => onChange({ text: e.target.value })}
            className="w-full bg-[#0D0F14] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-3 text-xs font-mono-code rounded-none resize-y min-h-[64px] focus:outline-none"
            placeholder="Enter specimen string..."
          />

          {/* Quick preset phrase pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#A1A1AA] uppercase font-bold shrink-0">Sample:</span>
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

        {/* ==================== TAB 1: AXES & TYPE ==================== */}
        {activeTab === 'type' && (
          <div className="space-y-5">
            
            {/* Font Family Selection with Category Filter & Upload */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[#A1A1AA] block text-xs font-semibold">
                  PRIMARY FONT ({allFonts.length} AVAILABLE)
                </label>
                
                {/* Upload Custom Font Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 text-xs font-bold transition-colors"
                    title="Upload local .ttf, .otf, or .woff file"
                  >
                    <Upload className="w-3 h-3" />
                    <span>UPLOAD FONT</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1 pb-1">
                {['all', 'grotesk', 'serif', 'monospace', 'display', 'experimental', 'custom'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFontCategoryFilter(cat)}
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors ${
                      fontCategoryFilter === cat
                        ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                        : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Font Dropdown */}
              <select
                value={state.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full bg-[#0D0F14] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-2.5 text-xs font-mono-code rounded-none focus:outline-none"
              >
                {filteredFonts.map((font) => (
                  <option key={font.id} value={font.cssFamily}>
                    {font.name} [{font.category.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Size Slider + Auto Fit */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span className="flex items-center gap-1.5">
                    SIZE (PT/PX)
                    <button
                      onClick={onAutoFitSize}
                      className="px-1.5 py-0.2 bg-[#1A251E] text-[#00FF66] text-[10px] font-bold border border-[#00FF66]/40 hover:bg-[#00FF66] hover:text-black transition-colors"
                      title="Auto fit text size to frame"
                    >
                      FIT
                    </button>
                  </span>
                  <span className="text-[#00FF66] font-bold">{state.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="180"
                  step="1"
                  value={state.fontSize}
                  onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                  className="w-full"
                  aria-label="Font Size"
                />
              </div>

              {/* Weight Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>WEIGHT (AXIS)</span>
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
                  aria-label="Font Weight"
                />
              </div>
            </div>

            {/* Tracking (Letter Spacing) & Leading (Line Height) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tracking */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>TRACKING (em)</span>
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
                  aria-label="Letter Spacing Tracking"
                />
              </div>

              {/* Leading */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>LEADING (HEIGHT)</span>
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
                  aria-label="Line Height Leading"
                />
              </div>
            </div>

            {/* Word Spacing */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>WORD SPACING (em)</span>
                <span className="text-[#00FF66] font-bold">{state.wordSpacing.toFixed(2)}em</span>
              </div>
              <input
                type="range"
                min="-0.30"
                max="1.50"
                step="0.05"
                value={state.wordSpacing}
                onChange={(e) => onChange({ wordSpacing: Number(e.target.value) })}
                className="w-full"
                aria-label="Word Spacing"
              />
            </div>

            {/* Alignment & Transformations Row */}
            <div className="space-y-2.5 pt-3 border-t border-[#1E232E]">
              <span className="text-[#A1A1AA] block text-xs font-semibold">ALIGNMENT & CASE</span>
              
              <div className="flex flex-wrap gap-2.5">
                {/* Alignment buttons */}
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
                      aria-label={`Align ${align}`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4" />}
                      {align === 'right' && <AlignRight className="w-4 h-4" />}
                      {align === 'justify' && <AlignJustify className="w-4 h-4" />}
                    </button>
                  ))}
                </div>

                {/* Transform Case buttons */}
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
                      title={`Text Transform ${transform}`}
                    >
                      {transform === 'none' ? 'Aa' : transform === 'uppercase' ? 'AA' : transform === 'lowercase' ? 'aa' : 'Ab'}
                    </button>
                  ))}
                </div>

                {/* Italic toggle */}
                <button
                  onClick={() => onChange({ isItalic: !state.isItalic })}
                  className={`px-3 py-1.5 text-xs italic font-serif border border-[#22262E] transition-colors ${
                    state.isItalic ? 'bg-[#1F2533] text-[#00FF66] border-[#00FF66]' : 'text-[#A1A1AA] bg-[#0D0F14]'
                  }`}
                  title="Toggle Italic / Slant"
                >
                  Italic
                </button>

                {/* Vertical writing mode toggle */}
                <button
                  onClick={() => onChange({ isVertical: !state.isVertical })}
                  className={`px-3 py-1.5 text-xs font-mono-code border border-[#22262E] transition-colors ${
                    state.isVertical ? 'bg-[#1F2533] text-[#00FF66] border-[#00FF66]' : 'text-[#A1A1AA] bg-[#0D0F14]'
                  }`}
                  title="Toggle Vertical Writing Mode"
                >
                  VERTICAL RL
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: FONT PAIRINGS (NEW!) ==================== */}
        {activeTab === 'pairings' && (
          <div className="space-y-5">
            
            {/* Secondary Text Layer Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#0D0F14] border border-[#22262E]">
              <div>
                <span className="font-bold text-[#F4F5F7] block text-xs">SECONDARY TEXT LAYER (PAIRING)</span>
                <span className="text-[11px] text-[#A1A1AA]">Compose headline + subhead/caption simultaneously</span>
              </div>
              <button
                onClick={() => onChange({ showSubText: !state.showSubText })}
                className={`px-3 py-1 text-xs font-bold border transition-colors ${
                  state.showSubText
                    ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                    : 'border-[#22262E] text-[#A1A1AA]'
                }`}
              >
                {state.showSubText ? 'LAYER: ON' : 'LAYER: OFF'}
              </button>
            </div>

            {/* Secondary Text Input & Controls if enabled */}
            {state.showSubText && (
              <div className="p-3.5 bg-[#0D0F14] border border-[#22262E] space-y-3">
                <span className="font-bold text-[#00FF66] text-xs block">
                  SECONDARY PAIRING TEXT & AXES
                </span>

                <textarea
                  value={state.subText}
                  onChange={(e) => onChange({ subText: e.target.value })}
                  placeholder="Enter secondary subheadline or body text..."
                  className="w-full bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-2.5 text-xs font-mono-code rounded-none resize-y min-h-[50px] focus:outline-none"
                />

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] text-xs font-semibold block">PAIRING FONT FAMILY</label>
                  <select
                    value={state.subFontFamily}
                    onChange={(e) => onChange({ subFontFamily: e.target.value })}
                    className="w-full bg-[#08090C] border border-[#22262E] focus:border-[#00FF66] text-[#F4F5F7] p-2 text-xs font-mono-code rounded-none focus:outline-none"
                  >
                    {allFonts.map((f) => (
                      <option key={f.id} value={f.cssFamily}>
                        {f.name} [{f.category.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#A1A1AA] text-[11px]">
                      <span>SIZE</span>
                      <span className="text-[#00FF66]">{state.subFontSize}px</span>
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

                  <div className="space-y-1">
                    <div className="flex justify-between text-[#A1A1AA] text-[11px]">
                      <span>WEIGHT</span>
                      <span className="text-[#00FF66]">{state.subFontWeight}</span>
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
              </div>
            )}

            {/* Curated Font Pairings Catalog */}
            <div className="space-y-3 pt-2 border-t border-[#1E232E]">
              <span className="text-[#A1A1AA] block text-xs font-semibold">
                CURATED CLASSIC & MODERN PAIRINGS (CLICK TO LOAD)
              </span>

              <div className="space-y-2.5">
                {CURATED_PAIRINGS.map((pairing) => (
                  <button
                    key={pairing.id}
                    onClick={() => {
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
                    }}
                    className="w-full text-left p-3.5 border border-[#22262E] bg-[#0D0F14] hover:bg-[#151922] hover:border-[#00FF66] transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F4F5F7] text-xs group-hover:text-[#00FF66] transition-colors">
                        {pairing.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#1A1F29] text-[#00FF66]">
                        {pairing.category}
                      </span>
                    </div>
                    <div className="mt-2 text-xs flex items-center gap-2 text-[#C2CAD8]">
                      <span className="font-bold text-[#F4F5F7]">{pairing.headlineFamily.split(',')[0].replace(/['"]/g, '')}</span>
                      <span className="text-[#00FF66]">+</span>
                      <span>{pairing.bodyFamily.split(',')[0].replace(/['"]/g, '')}</span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] mt-1.5 line-clamp-2 leading-relaxed">
                      {pairing.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: TRANSFORMS & KINETIC ==================== */}
        {activeTab === 'layout' && (
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

            {/* Vector Stroke / Outline Controls */}
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
                    aria-label="Stroke Width"
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
                      aria-label="Stroke Color Picker"
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
                  aria-label="Skew Angle"
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
                  aria-label="Rotation Angle"
                />
              </div>
            </div>

            {/* Canvas Aspect Ratio Framing */}
            <div className="space-y-2 pt-3 border-t border-[#1E232E]">
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

            {/* Grid Overlay Controls (Controlled opacity behind text) */}
            <div className="space-y-2 pt-3 border-t border-[#1E232E]">
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

          </div>
        )}

        {/* ==================== TAB 4: COLOR & ATMOSPHERE ==================== */}
        {activeTab === 'color' && (
          <div className="space-y-5">
            
            {/* Quick Invert button */}
            <button
              onClick={handleInvertColors}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#161B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#272F3E] transition-colors font-bold"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#00FF66]" />
              <span>INVERT FOREGROUND ⇄ BACKGROUND</span>
            </button>

            {/* Text Color Picker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>TEXT COLOR (FOREGROUND)</span>
                <span className="text-[#00FF66] font-bold uppercase">{state.textColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={state.textColor}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  className="w-10 h-10 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                  aria-label="Text Color"
                />
                <div className="flex flex-wrap gap-2 flex-1">
                  {[
                    { hex: '#F4F5F7', label: 'Laboratory White' },
                    { hex: '#00FF66', label: 'Phosphor Green' },
                    { hex: '#070809', label: 'Obsidian Black' },
                    { hex: '#FFB800', label: 'Hazard Amber' },
                    { hex: '#00E5FF', label: 'Laser Cyan' },
                    { hex: '#A1A1AA', label: 'Muted Zinc' },
                  ].map((item) => (
                    <button
                      key={item.hex}
                      onClick={() => onChange({ textColor: item.hex })}
                      className="w-7 h-7 border border-[#2B3342] relative hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.hex }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="space-y-2 pt-3 border-t border-[#1E232E]">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>CANVAS BACKGROUND COLOR</span>
                <span className="text-[#00FF66] font-bold uppercase">{state.backgroundColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-10 h-10 bg-transparent border border-[#22262E] cursor-pointer rounded-none p-0"
                  aria-label="Background Color"
                />
                <div className="flex flex-wrap gap-2 flex-1">
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
                      className="w-7 h-7 border border-[#2B3342] relative hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.hex }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background Original Photographic Texture Selection */}
            <div className="space-y-2 pt-3 border-t border-[#1E232E]">
              <label className="text-[#A1A1AA] block text-xs font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00FF66]" />
                ORIGINAL GRAPHIC TEXTURES (NONVERBAL)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
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
                    <div className="text-[11px] text-[#A1A1AA] mt-1 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Swiss Architectural Watermark Layer Controls */}
            <div className="p-3.5 bg-[#0D0F14] border border-[#22262E] space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F4F5F7] text-xs">SWISS ARCHITECTURAL WATERMARK</span>
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
                          className="px-2 py-1 bg-[#151922] text-[#A1A1AA] hover:text-[#00FF66] border border-[#22262E] text-[10px]"
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

            {/* Text Glow / Phosphor Radiation Toggle */}
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

        {/* ==================== TAB 5: PRESETS (08) ==================== */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <span className="text-[#A1A1AA] block text-xs font-semibold">
              CURATED HISTORICAL & EXPERIMENTAL PRESETS
            </span>
            <div className="space-y-2.5">
              {SPECIMEN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChange(preset.state)}
                  className="w-full text-left p-3.5 border border-[#22262E] bg-[#0D0F14] hover:bg-[#151922] hover:border-[#00FF66] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F4F5F7] text-xs group-hover:text-[#00FF66] transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-[#1A1F29] text-[#00FF66] font-mono-code font-bold">
                      {preset.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#71717A]">
                    <span>{preset.category}</span>
                    <span className="text-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      APPLY CONFIG →
                    </span>
                  </div>
                </button>
              ))}
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

    </div>
  );
};
