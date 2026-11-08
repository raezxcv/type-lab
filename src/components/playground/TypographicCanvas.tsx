import React, { useState, useRef, useEffect } from 'react';
import type { TypographicState } from '../../types';
import { ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface TypographicCanvasProps {
  state: TypographicState;
  onChangeText: (text: string) => void;
  onChangeSubText: (subText: string) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onAutoFitSize: () => void;
  onChangeTexture?: (texture: TypographicState['backgroundTexture']) => void;
  activeLayer?: 'headline' | 'secondary';
  onSelectLayer?: (layer: 'headline' | 'secondary') => void;
}

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const TEXTURE_ASSETS: Record<string, string> = {
  'none': '',
  'crumpled-paper': '/images/crumpled-paper-plate.jpg',
  'photostat': '/images/photostat-grain-plate.jpg',
  'darkroom': '/images/type-lab-darkroom-texture.jpg',
  'swiss-grid': '/images/swiss-grid-abstract-geometry.jpg',
  'macro-ink': '/images/macro-ink-interference-plate.jpg',
  'risograph': '/images/risograph-halftone-mesh.jpg',
  'distressed-xerox': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><filter id="distress"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/></filter><rect width="100%" height="100%" filter="url(#distress)" opacity="0.65"/><line x1="0" y1="20" x2="120" y2="20" stroke="#000" stroke-width="0.8" opacity="0.3"/><line x1="0" y1="85" x2="120" y2="85" stroke="#fff" stroke-width="0.5" opacity="0.4"/></svg>`),
  'glitch-matrix': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect width="3" height="12" fill="#ff0044" opacity="0.35"/><rect x="4" width="3" height="12" fill="#00ff66" opacity="0.35"/><rect x="8" width="3" height="12" fill="#00e5ff" opacity="0.35"/><line y1="6" x2="12" y2="6" stroke="#000" stroke-width="1" opacity="0.4"/></svg>`),
  'woodcut-hatch': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><line x1="0" y1="16" x2="16" y2="0" stroke="#ffffff" stroke-width="1.2" opacity="0.45"/><line x1="-4" y1="12" x2="12" y2="-4" stroke="#ffffff" stroke-width="0.8" opacity="0.25"/><line x1="4" y1="20" x2="20" y2="4" stroke="#ffffff" stroke-width="0.8" opacity="0.25"/></svg>`),
  'marbled-ink': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><filter id="marble"><feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="5" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="35"/></filter><g filter="url(#marble)" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.5"><path d="M 0,20 Q 50,80 100,20 T 200,20"/><path d="M 0,70 Q 60,10 120,80 T 200,70"/><path d="M 0,130 Q 70,180 140,110 T 200,140"/><path d="M 0,180 Q 40,120 100,190 T 200,180"/></g></svg>`),
  'thermal-fax': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.2" fill="#00FF66" opacity="0.5"/><rect width="8" height="1" fill="#ffffff" opacity="0.2"/></svg>`),
  'halftone-dots': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5" fill="#ffffff" opacity="0.85"/><circle cx="0" cy="0" r="1.5" fill="#ffffff" opacity="0.5"/><circle cx="20" cy="20" r="1.5" fill="#ffffff" opacity="0.5"/></svg>`),
  'cyber-scanline': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6"><rect width="6" height="3" fill="#ffffff" opacity="0.5"/><rect y="3" width="6" height="3" fill="#000000" opacity="0.5"/></svg>`),
  'blueprint-grid': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00FF66" stroke-width="0.8" opacity="0.45"/><circle cx="48" cy="48" r="2" fill="#00FF66" opacity="0.85"/></svg>`),
  'film-grain': encodeSvg(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.75"/></svg>`)
};

const TINT_COLORS: Record<string, string> = {
  none: 'transparent',
  green: '#00FF66',
  amber: '#FFB800',
  cyan: '#00E5FF',
  crimson: '#FF3366',
  monochrome: '#FFFFFF',
};

const FRAME_BASE_DIMENSIONS: Record<TypographicState['canvasFrame'], { w: number; h: number }> = {
  poster: { w: 500, h: 700 },      // Classic Swiss A4 proportion (1:1.4)
  square: { w: 540, h: 540 },      // 1:1
  editorial: { w: 520, h: 650 },   // 4:5
  ribbon: { w: 720, h: 300 },      // 21:9
  fluid: { w: 600, h: 480 },       // Fluid
};

export const TypographicCanvas: React.FC<TypographicCanvasProps> = ({
  state,
  onChangeText,
  onChangeSubText,
  onChangeTexture,
  canvasRef,
  onAutoFitSize,
  onSelectLayer,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFitMode, setIsFitMode] = useState<boolean>(true);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 700, height: 600 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const currentTextureUrl = TEXTURE_ASSETS[state.backgroundTexture] || '';
  const baseDims = FRAME_BASE_DIMENSIONS[state.canvasFrame] || { w: 500, h: 700 };

  // Responsive padding buffer: 24px on desktop, 12px on mobile
  const bufferX = stageSize.width < 640 ? 12 : 24;
  const bufferY = stageSize.height < 640 ? 12 : 24;

  const availableW = Math.max(160, stageSize.width - bufferX);
  const availableH = Math.max(160, stageSize.height - bufferY);

  // Auto-fit scale factor: fits both width and height exactly within available viewport stage
  const autoFitScale = Math.min(availableW / baseDims.w, availableH / baseDims.h);
  
  // Effective scale applied
  const effectiveScale = isFitMode ? autoFitScale : (zoomLevel / 100);

  // Primary Headline typographic styles
  const headlineStyle: React.CSSProperties = {
    fontFamily: state.fontFamily,
    fontSize: `${state.fontSize}px`,
    fontWeight: state.fontWeight,
    fontStyle: state.isItalic ? 'italic' : 'normal',
    letterSpacing: `${state.letterSpacing}em`,
    lineHeight: state.lineHeight,
    wordSpacing: `${state.wordSpacing}em`,
    textAlign: state.textAlign,
    textTransform: state.textTransform,
    color: state.textColor,
    WebkitTextStroke: state.strokeWidth > 0 ? `${state.strokeWidth}px ${state.strokeColor}` : undefined,
    writingMode: state.isVertical ? 'vertical-rl' : 'horizontal-tb',
    transform: `skewX(${state.skew}deg) rotate(${state.rotation}deg)`,
    textShadow: state.textShadow ? `0 0 24px ${state.shadowGlowColor}` : 'none',
    opacity: state.opacity,
    transition: 'transform 0.15s ease-out',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  // Helper to render inline graphic plates (above, between, below typography)
  const renderInlineImagePlate = (position: 'above' | 'between' | 'below') => {
    if (!state.showImageLayer || !state.imageUrl || state.imagePlacement !== position) return null;
    const maxPlateHeight = Math.min(state.imageHeight || 180, Math.round(baseDims.h * 0.28));
    return (
      <div className="w-full my-1.5 border border-current/25 overflow-hidden relative group shrink-0">
        <img
          src={state.imageUrl}
          alt={state.imageCaption || "Graphic Plate"}
          className="w-full object-cover transition-all"
          style={{
            maxHeight: `${maxPlateHeight}px`,
            opacity: state.imageOpacity ?? 0.85,
            mixBlendMode: (state.imageBlendMode as any) || 'normal',
            filter: state.imageFilter === 'grayscale' ? 'grayscale(1)' :
                    state.imageFilter === 'invert' ? 'invert(1)' :
                    state.imageFilter === 'high-contrast' ? 'contrast(1.6) brightness(1.1)' :
                    state.imageFilter === 'duotone' ? 'grayscale(1) contrast(1.4) sepia(1) hue-rotate(90deg)' : 'none',
          }}
        />
        {state.imageCaption && (
          <div className="text-[10px] font-mono-code uppercase px-2 py-0.5 bg-black/75 text-[#F4F5F7] border-t border-current/20 flex justify-between items-center">
            <span className="truncate pr-2">{state.imageCaption}</span>
            <span className="text-[#00FF66] shrink-0 font-bold">PLATE // REF</span>
          </div>
        )}
      </div>
    );
  };

  // Secondary Pairing Text styles
  const subTextStyle: React.CSSProperties = {
    fontFamily: state.subFontFamily,
    fontSize: `${state.subFontSize}px`,
    fontWeight: state.subFontWeight,
    letterSpacing: `${state.subLetterSpacing}em`,
    color: state.subTextColor,
    textAlign: state.textAlign,
    lineHeight: 1.5,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-2 sm:p-3 bg-[#070809] overflow-hidden select-none">
      
      {/* Background subtle laboratory grid */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-25 pointer-events-none" />

      {/* Canvas Top Toolbar & Viewport Controls */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 pb-2 px-3 sm:px-4 text-xs font-mono-code text-[#A1A1AA] z-10 border-b border-[#1A1F29] mb-1 shrink-0">
        
        {/* Dimensions & Active Metrics */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
          <h1 className="flex items-center gap-1.5 text-[#00FF66] font-bold text-xs uppercase m-0 shrink-0">
            <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse"></span>
            <span className="hidden sm:inline">TYPE//LAB 11</span>
          </h1>
          <span className="text-[#3A4354] hidden sm:inline">|</span>
          <span className="text-xs truncate font-semibold">[{state.canvasFrame.toUpperCase()}]</span>
          <span className="text-[#3A4354] hidden md:inline">|</span>
          <span className="text-xs hidden md:inline">{state.fontSize}px</span>
          <span className="text-[#3A4354]">|</span>
          <button
            onClick={() => {
              const textures: Array<TypographicState['backgroundTexture']> = [
                'none', 'photostat', 'darkroom', 'swiss-grid', 'macro-ink', 'risograph',
                'crumpled-paper', 'marbled-ink', 'distressed-xerox', 'glitch-matrix',
                'woodcut-hatch', 'thermal-fax', 'halftone-dots', 'cyber-scanline',
                'blueprint-grid', 'film-grain'
              ];
              const idx = textures.indexOf(state.backgroundTexture);
              const next = textures[(idx + 1) % textures.length];
              onChangeTexture?.(next);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 bg-[#12161F] hover:bg-[#1A222F] text-[#00FF66] border border-[#232B3B] transition-colors text-[11px] font-bold shrink-0"
            title="Cycle background texture plate"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]"></span>
            <span className="truncate max-w-[90px] sm:max-w-none">BG: {state.backgroundTexture.toUpperCase()}</span>
            <span className="text-[#8E97A8] text-[10px]">⇄</span>
          </button>
        </div>

        {/* Action controls: Auto-fit text & Screen-Fit Zoom */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={onAutoFitSize}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 transition-colors font-bold text-xs"
            title="Automatically scale font size so all lines fit within canvas"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FIT TEXT</span>
          </button>

          <div className="flex items-center border border-[#262C3A] bg-[#0E1117] p-0.5">
            <button
              onClick={() => setIsFitMode(true)}
              className={`px-2 py-0.5 text-[11px] font-bold font-mono-code transition-colors ${
                isFitMode ? 'bg-[#00FF66] text-[#070809]' : 'text-[#A1A1AA] hover:text-[#00FF66]'
              }`}
              title="Fit poster perfectly to screen height (No scroll)"
            >
              FIT
            </button>
            <button
              onClick={() => {
                setIsFitMode(false);
                setZoomLevel(prev => Math.max(40, prev - 10));
              }}
              className="px-1.5 py-0.5 hover:text-[#00FF66] text-[#A1A1AA]"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 py-0.5 text-[11px] text-[#C2CAD8] min-w-[38px] text-center">
              {Math.round(effectiveScale * 100)}%
            </span>
            <button
              onClick={() => {
                setIsFitMode(false);
                setZoomLevel(prev => Math.min(160, prev + 10));
              }}
              className="px-1.5 py-0.5 hover:text-[#00FF66] text-[#A1A1AA]"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Viewport Artboard Stage — Always fits screen height without scrolling */}
      <div 
        ref={stageRef}
        className="flex-1 min-h-0 w-full flex items-center justify-center relative overflow-hidden my-auto"
      >
        <div 
          className="flex items-center justify-center relative select-none shadow-2xl transition-all duration-150"
          style={{
            width: `${Math.round(baseDims.w * effectiveScale)}px`,
            height: `${Math.round(baseDims.h * effectiveScale)}px`,
          }}
        >
          <div
            style={{
              width: `${baseDims.w}px`,
              height: `${baseDims.h}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
            }}
            className="absolute top-0 left-0"
          >
            {/* THE CORE ARTBOARD POSTER CONTAINER */}
            <div
              ref={canvasRef}
              id="typography-export-target"
              className="w-full h-full relative transition-all duration-200 flex flex-col justify-between p-6 sm:p-8 border border-[#262C3A] overflow-hidden shadow-2xl"
              style={{
                backgroundColor: state.backgroundColor,
              }}
            >
          
          {/* CUSTOMIZABLE ORIGINAL GRAPHIC TEXTURE LAYER */}
          {state.backgroundTexture !== 'none' && currentTextureUrl && (
            <div 
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
              style={{
                opacity: state.textureOpacity ?? 0.45,
                mixBlendMode: state.textureBlendMode ?? 'overlay',
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url("${currentTextureUrl}")`,
                  backgroundSize: state.textureRepeat === 'repeat' 
                    ? `${state.textureScale ?? 100}%` 
                    : (state.textureRepeat === 'contain' ? 'contain' : 'cover'),
                  backgroundRepeat: state.textureRepeat === 'repeat' ? 'repeat' : 'no-repeat',
                  backgroundPosition: 'center',
                  transform: (state.textureScale && state.textureScale !== 100 && state.textureRepeat !== 'repeat')
                    ? `scale(${state.textureScale / 100})` 
                    : undefined,
                  transformOrigin: 'center center',
                  filter: [
                    `contrast(${state.textureContrast ?? 100}%)`,
                    `brightness(${state.textureBrightness ?? 100}%)`,
                    state.textureBlur && state.textureBlur > 0 ? `blur(${state.textureBlur}px)` : '',
                    state.textureInvert ? 'invert(1)' : '',
                  ].filter(Boolean).join(' '),
                }}
              />
              {state.textureTint && state.textureTint !== 'none' && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: TINT_COLORS[state.textureTint] || 'transparent',
                    mixBlendMode: 'color',
                    opacity: 0.6,
                  }}
                />
              )}
            </div>
          )}

          {/* CUSTOM BACKGROUND IMAGE LAYER */}
          {state.showImageLayer && state.imageUrl && state.imagePlacement === 'background' && (
            <div 
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
              style={{
                opacity: state.imageOpacity ?? 0.8,
                mixBlendMode: state.imageBlendMode ?? 'normal',
              }}
            >
              <img
                src={state.imageUrl}
                alt="Poster Background Plate"
                className="w-full h-full"
                style={{
                  objectFit: state.imageFit ?? 'cover',
                  filter: state.imageFilter === 'grayscale' ? 'grayscale(1)' :
                          state.imageFilter === 'invert' ? 'invert(1)' :
                          state.imageFilter === 'high-contrast' ? 'contrast(1.6) brightness(1.1)' :
                          state.imageFilter === 'duotone' ? 'grayscale(1) contrast(1.4) sepia(1) hue-rotate(90deg)' : 'none',
                }}
              />
            </div>
          )}

          {/* BACKGROUND WATERMARK / SWISS ARCHITECTURAL CHARACTER */}
          {state.showWatermark && state.watermarkText && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
              style={{ opacity: state.watermarkOpacity }}
              aria-hidden="true"
            >
              <svg className="w-full h-full pointer-events-none select-none" aria-hidden="true" viewBox="0 0 500 500">
                <text 
                  x="50%" 
                  y="52%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fill={state.textColor}
                  fontSize={Math.min(state.watermarkSize, 200)}
                  fontWeight="900"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {state.watermarkText}
                </text>
              </svg>
            </div>
          )}

          {/* GRID OVERLAYS (STRICTLY BACKGROUND z-0 SO THEY NEVER CUT ACROSS LETTERS) */}
          {state.showGrid && state.gridType === 'modular' && (
            <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 gap-2 p-6 pointer-events-none z-0 opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-x border-[#00FF66]/40 bg-[#00FF66]/5" />
              ))}
            </div>
          )}

          {state.showGrid && state.gridType === 'baseline' && (
            <div className="absolute inset-0 swiss-grid-pattern-dense opacity-40 pointer-events-none z-0" />
          )}

          {state.showGrid && state.gridType === 'crosshair' && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-25">
              <div className="w-full h-[1px] bg-[#00FF66]" />
              <div className="absolute h-full w-[1px] bg-[#00FF66]" />
              <div className="absolute w-28 h-28 border border-[#00FF66] rounded-full" />
            </div>
          )}

          {/* Top Poster Header Metadata - Safe spacing, clear of text */}
          <div 
            className="relative z-10 flex justify-between items-start text-xs font-mono-code border-b border-current/25 pb-3 mb-6" 
            style={{ color: state.textColor }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-xs">Type Laboratory Experimental Specimen</span>
              <span className="opacity-75 text-[11px]">Series: Kinetic Swiss Modernism</span>
            </div>
            <div className="text-right flex flex-col">
              <span className="font-semibold text-xs">
                {state.fontFamily.split(',')[0].replace(/['"]/g, '')}
                {state.showSubText && ` + ${state.subFontFamily.split(',')[0].replace(/['"]/g, '')}`}
              </span>
              <span className="opacity-75 text-[11px]">Size: {state.fontSize}px // Leading: {state.lineHeight}</span>
            </div>
          </div>

          {/* CORE TYPOGRAPHIC CONTENT CONTAINER - EXPANDS FREELY TO ALWAYS SHOW FULL TEXT */}
          <div 
            ref={textContainerRef}
            className="relative z-10 my-auto flex flex-col justify-center w-full py-6 space-y-4"
          >
            {/* INLINE IMAGE PLATE: ABOVE HEADLINE */}
            {renderInlineImagePlate('above')}
            
            {/* MARQUEE KINETIC MODE */}
            {state.kineticMode === 'marquee' ? (
              <div className="w-full overflow-hidden whitespace-nowrap">
                <div className="animate-marquee py-2">
                  <span style={headlineStyle} className="pr-12 inline-block">
                    {state.text}
                  </span>
                  <span style={headlineStyle} className="pr-12 inline-block">
                    {state.text}
                  </span>
                </div>
              </div>
            ) : state.kineticMode === 'breath' ? (
              /* BREATH KINETIC MODE */
              <div className="w-full text-center">
                <div 
                  className="animate-breath inline-block w-full focus:outline-none"
                  style={headlineStyle}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onChangeText(e.currentTarget.innerText)}
                >
                  {state.text}
                </div>
              </div>
            ) : state.kineticMode === 'skew-wobble' ? (
              /* SKEW WOBBLE KINETIC MODE */
              <div className="w-full text-center">
                <div 
                  className="animate-skew-wobble inline-block w-full focus:outline-none"
                  style={headlineStyle}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onChangeText(e.currentTarget.innerText)}
                >
                  {state.text}
                </div>
              </div>
            ) : (
              /* PRIMARY DIRECT EDITABLE HEADLINE - 100% UNCLIPPED & EXPANDS DYNAMICALLY */
              <div 
                className="w-full relative transition-all duration-200"
                onClick={() => onSelectLayer?.('headline')}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => onSelectLayer?.('headline')}
                  onBlur={(e) => onChangeText(e.currentTarget.innerText)}
                  className="w-full focus:outline-none focus:ring-1 focus:ring-[#00FF66]/30 rounded-none cursor-text transition-all"
                  style={headlineStyle}
                  title="Click directly to edit headline"
                >
                  {state.text}
                </div>
              </div>
            )}

            {/* INLINE IMAGE PLATE: BETWEEN HEADLINE AND SECONDARY */}
            {renderInlineImagePlate('between')}

            {/* SECONDARY FONT PAIRING TEXT LAYER (SUBHEADLINE / BODY) */}
            {state.showSubText && state.subText && (
              <div 
                className="w-full pt-3 mt-2 border-t border-current/15 relative transition-all duration-200"
                onClick={() => onSelectLayer?.('secondary')}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => onSelectLayer?.('secondary')}
                  onBlur={(e) => onChangeSubText(e.currentTarget.innerText)}
                  className="w-full focus:outline-none focus:ring-1 focus:ring-[#00FF66]/30 rounded-none cursor-text transition-all"
                  style={subTextStyle}
                  title="Click directly to edit secondary pairing text"
                >
                  {state.subText}
                </div>
              </div>
            )}

            {/* INLINE IMAGE PLATE: BELOW SECONDARY */}
            {renderInlineImagePlate('below')}

          </div>

          {/* Bottom Poster Footer Metadata - Safe spacing, clear of text */}
          <div 
            className="relative z-10 flex justify-between items-end text-xs font-mono-code border-t border-current/25 pt-3 mt-6" 
            style={{ color: state.textColor }}
          >
            <div className="flex flex-col space-y-0.5">
              <span className="font-semibold text-xs">Allgemeine Gewerbeschule Basel // Zürich Tonhalle</span>
              <span className="opacity-75 text-[11px]">Type Playground Digital Specimen Engine</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="inline-block px-2 py-0.5 border border-current text-xs font-semibold">
                Specimen Fig. 11-A
              </span>
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom coordinate note */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-1.5 px-5 sm:px-6 text-[11px] font-mono-code text-[#758091] shrink-0 border-t border-[#161B24]">
        <span className="truncate">DIN 476 Modular System Standard</span>
        <span className="hidden sm:inline shrink-0">X: 000.00mm // Y: 000.00mm</span>
      </div>

    </div>
  );
};
