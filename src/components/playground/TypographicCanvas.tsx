import React from 'react';
import type { TypographicState } from '../../types';

interface TypographicCanvasProps {
  state: TypographicState;
  onChangeText: (text: string) => void;
  backgroundTexture: 'none' | 'darkroom' | 'swiss-grid' | 'macro-ink';
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const TypographicCanvas: React.FC<TypographicCanvasProps> = ({
  state,
  onChangeText,
  backgroundTexture,
  canvasRef,
}) => {
  const textureUrls = {
    'none': '',
    'darkroom': '/images/type-lab-darkroom-texture.jpg',
    'swiss-grid': '/images/swiss-grid-abstract-geometry.jpg',
    'macro-ink': '/images/macro-ink-interference-plate.jpg'
  };

  const currentTextureUrl = textureUrls[backgroundTexture];

  // Aspect ratio classes
  const frameClasses = {
    poster: 'max-w-[560px] aspect-[1/1.414] w-full',
    square: 'max-w-[560px] aspect-square w-full',
    ribbon: 'max-w-full aspect-[21/9] w-full',
    editorial: 'max-w-[580px] aspect-[4/5] w-full',
    fluid: 'w-full min-h-[500px]',
  }[state.canvasFrame];

  // Dynamic inline styling for the typography
  const typographicStyle: React.CSSProperties = {
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
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14 min-h-[620px] bg-[#0A0C10] border border-[#1A1F29] overflow-hidden select-none">
      
      {/* Background subtle laboratory grid */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-30 pointer-events-none" />

      {/* Frame Dimension & Telemetry Tags - 12px readable size */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-4 text-xs font-mono-code text-[#A1A1AA] z-10">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-2 text-[#00FF66] font-semibold">
            <span className="w-2 h-2 bg-[#00FF66] inline-block"></span>
            CANVAS FRAME: [{state.canvasFrame.toUpperCase()}]
          </span>
          <span className="hidden sm:inline text-[#3A4354]">|</span>
          <span className="hidden sm:inline">SCALE: {state.fontSize}px // WT: {state.fontWeight}</span>
          <span className="hidden md:inline text-[#3A4354]">|</span>
          <span className="hidden md:inline">TRACK: {state.letterSpacing > 0 ? `+${state.letterSpacing}` : state.letterSpacing}em</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono-code text-[#A1A1AA]">
          <span>CALIBRATION: 100% DPI</span>
        </div>
      </div>

      {/* THE ACTUAL CANVAS ARTBOARD CONTAINER */}
      <div
        ref={canvasRef}
        id="typography-export-target"
        className={`relative mx-auto transition-all duration-300 flex flex-col justify-between p-8 sm:p-12 border border-[#262C3A] overflow-hidden ${frameClasses}`}
        style={{
          backgroundColor: state.backgroundColor,
          backgroundImage: currentTextureUrl ? `url(${currentTextureUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Texture blend overlay if image is loaded */}
        {currentTextureUrl && (
          <div className="absolute inset-0 bg-[#070809]/40 pointer-events-none" />
        )}

        {/* MODULAR GRID OVERLAY */}
        {state.showGrid && state.gridType === 'modular' && (
          <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 gap-2 p-6 pointer-events-none z-10 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-full border-x border-[#00FF66]/30 bg-[#00FF66]/5" />
            ))}
          </div>
        )}

        {/* BASELINE GRID OVERLAY */}
        {state.showGrid && state.gridType === 'baseline' && (
          <div className="absolute inset-0 swiss-grid-pattern-dense opacity-60 pointer-events-none z-10" />
        )}

        {/* CROSSHAIR GRID OVERLAY */}
        {state.showGrid && state.gridType === 'crosshair' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-40">
            <div className="w-full h-[1px] bg-[#00FF66]" />
            <div className="absolute h-full w-[1px] bg-[#00FF66]" />
            <div className="absolute w-24 h-24 border border-[#00FF66] rounded-full" />
            <div className="absolute top-4 left-4 text-xs font-mono-code text-[#00FF66]">⊕ OPTICAL CENTER</div>
          </div>
        )}

        {/* Top Poster Header Metadata */}
        <div className="relative z-20 flex justify-between items-start text-[13px] font-mono-code border-b border-current/25 pb-3 mb-4" style={{ color: state.textColor }}>
          <div className="flex flex-col">
            <span className="font-semibold text-[13px]">Type Laboratory Experimental Specimen</span>
            <span className="opacity-75 text-[12px]">Series: Kinetic Swiss Modernism</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="font-semibold text-[13px]">Typeface: {state.fontFamily.split(',')[0].replace(/['"]/g, '')}</span>
            <span className="opacity-75 text-[12px]">Size: {state.fontSize}px // Leading: {state.lineHeight}</span>
          </div>
        </div>

        {/* CORE TYPOGRAPHIC CONTENT DISPLAY */}
        <div className="relative z-20 my-auto flex items-center justify-center w-full overflow-hidden py-6">
          
          {/* MARQUEE KINETIC MODE */}
          {state.kineticMode === 'marquee' ? (
            <div className="w-full overflow-hidden whitespace-nowrap">
              <div className="animate-marquee py-2">
                <span style={typographicStyle} className="pr-12 inline-block">
                  {state.text}
                </span>
                <span style={typographicStyle} className="pr-12 inline-block">
                  {state.text}
                </span>
              </div>
            </div>
          ) : state.kineticMode === 'breath' ? (
            /* BREATH KINETIC MODE */
            <div className="w-full text-center">
              <div 
                className="animate-breath inline-block w-full"
                style={typographicStyle}
              >
                <textarea
                  value={state.text}
                  onChange={(e) => onChangeText(e.target.value)}
                  className="w-full bg-transparent border-none resize-none focus:outline-none p-0 overflow-hidden text-center"
                  rows={state.text.split('\n').length || 1}
                  style={typographicStyle}
                  aria-label="Interactive Typography Live Canvas"
                />
              </div>
            </div>
          ) : state.kineticMode === 'skew-wobble' ? (
            /* SKEW WOBBLE KINETIC MODE */
            <div className="w-full text-center">
              <div 
                className="animate-skew-wobble inline-block w-full"
                style={typographicStyle}
              >
                <textarea
                  value={state.text}
                  onChange={(e) => onChangeText(e.target.value)}
                  className="w-full bg-transparent border-none resize-none focus:outline-none p-0 overflow-hidden"
                  rows={state.text.split('\n').length || 1}
                  style={typographicStyle}
                  aria-label="Interactive Typography Live Canvas"
                />
              </div>
            </div>
          ) : (
            /* STATIC / DIRECT EDITABLE MODE */
            <div className="w-full flex justify-center items-center">
              <textarea
                value={state.text}
                onChange={(e) => onChangeText(e.target.value)}
                className="w-full bg-transparent border-none resize-none focus:outline-none p-0 overflow-hidden focus:ring-1 focus:ring-[#00FF66]/40 transition-all cursor-text"
                rows={state.text.split('\n').length || 1}
                style={typographicStyle}
                placeholder="Type directly onto canvas..."
                aria-label="Interactive Typography Live Canvas"
              />
            </div>
          )}

        </div>

        {/* Bottom Poster Footer Metadata */}
        <div className="relative z-20 flex justify-between items-end text-[13px] font-mono-code border-t border-current/25 pt-3 mt-4" style={{ color: state.textColor }}>
          <div className="flex flex-col space-y-0.5">
            <span className="font-semibold text-[13px]">Allgemeine Gewerbeschule Basel // Zürich Tonhalle</span>
            <span className="opacity-75 text-[12px]">Type Playground Digital Specimen Engine</span>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="inline-block px-2 py-0.5 border border-current text-[12px] font-semibold">
              Specimen Fig. 11-A
            </span>
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
