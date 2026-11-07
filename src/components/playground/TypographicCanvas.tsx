import React, { useState, useRef } from 'react';
import type { TypographicState } from '../../types';
import { ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface TypographicCanvasProps {
  state: TypographicState;
  onChangeText: (text: string) => void;
  onChangeSubText: (subText: string) => void;
  backgroundTexture: 'none' | 'darkroom' | 'swiss-grid' | 'macro-ink';
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onAutoFitSize: () => void;
  activeLayer?: 'headline' | 'secondary';
  onSelectLayer?: (layer: 'headline' | 'secondary') => void;
}

export const TypographicCanvas: React.FC<TypographicCanvasProps> = ({
  state,
  onChangeText,
  onChangeSubText,
  backgroundTexture,
  canvasRef,
  onAutoFitSize,
  activeLayer = 'headline',
  onSelectLayer,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  const textureUrls = {
    'none': '',
    'darkroom': '/images/type-lab-darkroom-texture.jpg',
    'swiss-grid': '/images/swiss-grid-abstract-geometry.jpg',
    'macro-ink': '/images/macro-ink-interference-plate.jpg'
  };

  const currentTextureUrl = textureUrls[backgroundTexture];

  // Dynamic aspect ratio classes with flexible vertical breathing room
  const frameClasses = {
    poster: 'max-w-[560px] min-h-[720px] w-full',
    square: 'max-w-[560px] min-h-[560px] w-full',
    ribbon: 'max-w-full min-h-[300px] w-full',
    editorial: 'max-w-[580px] min-h-[680px] w-full',
    fluid: 'w-full min-h-[500px]',
  }[state.canvasFrame];

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
    <div className="relative w-full flex flex-col items-center justify-start p-4 sm:p-8 lg:p-10 min-h-[640px] bg-[#070809] overflow-hidden select-none">
      
      {/* Background subtle laboratory grid */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-25 pointer-events-none" />

      {/* Canvas Top Toolbar & Viewport Controls */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pb-4 text-xs font-mono-code text-[#A1A1AA] z-10 border-b border-[#1A1F29] mb-4">
        
        {/* Dimensions & Active Metrics */}
        <div className="flex items-center space-x-3">
          <h1 className="flex items-center gap-2 text-[#00FF66] font-bold text-xs uppercase m-0">
            <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse"></span>
            TYPE//LAB 11 STUDIO
          </h1>
          <span className="text-[#3A4354]">|</span>
          <span className="text-xs">FRAME: [{state.canvasFrame.toUpperCase()}]</span>
          <span className="text-[#3A4354]">|</span>
          <span className="text-xs">SCALE: {state.fontSize}px</span>
        </div>

        {/* Action controls: Auto-fit text & Zoom */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoFitSize}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 transition-colors font-bold text-xs"
            title="Automatically scale font size so all lines fit within canvas"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>FIT TEXT TO FRAME</span>
          </button>

          <div className="flex items-center border border-[#262C3A] bg-[#0E1117]">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              className="px-2 py-1 hover:text-[#00FF66] text-[#A1A1AA]"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 text-[11px] text-[#C2CAD8] min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="px-2 py-1 hover:text-[#00FF66] text-[#A1A1AA]"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={() => setZoomLevel(100)}
                className="px-1.5 py-1 text-[11px] text-[#00FF66] border-l border-[#262C3A]"
                title="Reset zoom to 100%"
              >
                100%
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Zoomable Canvas Viewport Container */}
      <div 
        className="w-full flex justify-center items-start overflow-x-auto py-2 transition-transform duration-200"
        style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined, transformOrigin: 'top center' }}
      >
        
        {/* THE CORE ARTBOARD POSTER CONTAINER */}
        <div
          ref={canvasRef}
          id="typography-export-target"
          className={`relative transition-all duration-300 flex flex-col justify-between p-8 sm:p-12 border border-[#262C3A] shadow-2xl ${frameClasses}`}
          style={{
            backgroundColor: state.backgroundColor,
            backgroundImage: currentTextureUrl ? `url(${currentTextureUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          
          {/* Subtle texture blend layer if image is active */}
          {currentTextureUrl && (
            <div className="absolute inset-0 bg-[#070809]/45 pointer-events-none z-0" />
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
            className="relative z-10 my-auto flex flex-col justify-center w-full py-6 space-y-5"
          >
            
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
                className={`w-full relative transition-all duration-200 rounded p-1.5 ${
                  activeLayer === 'headline' ? 'border border-[#00FF66]/60 bg-[#00FF66]/[0.02]' : 'border border-transparent hover:border-[#00FF66]/30'
                }`}
                onClick={() => onSelectLayer?.('headline')}
              >
                {activeLayer === 'headline' && (
                  <div className="absolute -top-3 left-1 px-1.5 py-0.5 bg-[#00FF66] text-black text-xs font-mono-code font-bold select-none pointer-events-none">
                    Active headline layer
                  </div>
                )}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => onSelectLayer?.('headline')}
                  onBlur={(e) => onChangeText(e.currentTarget.innerText)}
                  className="w-full focus:outline-none rounded-none cursor-text transition-all"
                  style={headlineStyle}
                  title="Click directly to edit headline"
                >
                  {state.text}
                </div>
              </div>
            )}

            {/* SECONDARY FONT PAIRING TEXT LAYER (SUBHEADLINE / BODY) */}
            {state.showSubText && state.subText && (
              <div 
                className={`w-full pt-3 mt-2 border-t border-current/15 relative transition-all duration-200 rounded p-1.5 ${
                  activeLayer === 'secondary' ? 'border border-[#00FF66]/60 bg-[#00FF66]/[0.02]' : 'border border-transparent hover:border-[#00FF66]/30'
                }`}
                onClick={() => onSelectLayer?.('secondary')}
              >
                {activeLayer === 'secondary' && (
                  <div className="absolute -top-3 left-1 px-1.5 py-0.5 bg-[#00FF66] text-black text-xs font-mono-code font-bold select-none pointer-events-none">
                    Active secondary layer
                  </div>
                )}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => onSelectLayer?.('secondary')}
                  onBlur={(e) => onChangeSubText(e.currentTarget.innerText)}
                  className="w-full focus:outline-none rounded-none cursor-text transition-all"
                  style={subTextStyle}
                  title="Click directly to edit secondary pairing text"
                >
                  {state.subText}
                </div>
              </div>
            )}

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

      {/* Bottom coordinate note */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-4 text-xs font-mono-code text-[#758091]">
        <span>DIN 476 Modular System Standard</span>
        <span>X: 000.00mm // Y: 000.00mm</span>
      </div>

    </div>
  );
};
