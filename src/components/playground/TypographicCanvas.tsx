import React, { useState, useRef, useEffect } from 'react';
import type { TypographicState, PosterLayout } from '../../types';
import { ZoomIn, ZoomOut, Sparkles, Layout } from 'lucide-react';

interface TypographicCanvasProps {
  state: TypographicState;
  onChangeText: (text: string) => void;
  onChangeSubText: (subText: string) => void;
  onUpdateState?: (updates: Partial<TypographicState>) => void;
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
  'ferrofluid-bloom': '/images/ferrofluid-ink-bloom.jpg',
  'brutalist-vault': '/images/brutalist-concrete-vault.jpg',
  'wheatpaste-fold': '/images/folded-wheatpaste-poster.jpg',
  'suminagashi-ink': '/images/suminagashi-marble-ink.jpg',
  'celluloid-burn': '/images/celluloid-film-burn.jpg',
  'kraft-collage': '/images/torn-kraft-collage.jpg',
  'oxidized-etching': '/images/oxidized-etching-plate.jpg',
  'brutalist-facade': '/images/swiss-brutalist-facade.jpg',
  'cyanotype-plate': '/images/cyanotype-botanical-plate.jpg',
  'charcoal-frottage': '/images/charcoal-frottage-rubbing.jpg',
  'wet-collodion': '/images/wet-collodion-tintype.jpg',
  'concrete-coffer': '/images/concrete-coffer-brutalist.jpg',
  'litho-stone': '/images/litho-stone-graining.jpg',
  'burnt-vellum': '/images/burnt-vellum-parchment.jpg',
  'newsprint-micro': '/images/halftone-newsprint-micro.jpg',
  'silver-solarize': '/images/silver-gelatin-solarize.jpg',
  'distressed-xerox': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="distress"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.8" intercept="-0.35"/><feFuncG type="linear" slope="1.8" intercept="-0.35"/><feFuncB type="linear" slope="1.8" intercept="-0.35"/><feFuncA type="linear" slope="0.55" intercept="0"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#distress)" opacity="0.5"/><line x1="0" y1="28" x2="160" y2="28" stroke="#ffffff" stroke-width="0.6" opacity="0.22"/><line x1="0" y1="112" x2="160" y2="112" stroke="#ffffff" stroke-width="0.4" opacity="0.18"/></svg>`),
  'glitch-matrix': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><rect width="3" height="12" fill="#ffffff" opacity="0.32"/><rect x="4" width="3" height="12" fill="#888888" opacity="0.28"/><rect x="8" width="3" height="12" fill="#ffffff" opacity="0.22"/><line y1="6" x2="12" y2="6" stroke="#000" stroke-width="1" opacity="0.35"/></svg>`),
  'woodcut-hatch': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><line x1="0" y1="16" x2="16" y2="0" stroke="#ffffff" stroke-width="1.2" opacity="0.45"/><line x1="-4" y1="12" x2="12" y2="-4" stroke="#ffffff" stroke-width="0.8" opacity="0.25"/><line x1="4" y1="20" x2="20" y2="4" stroke="#ffffff" stroke-width="0.8" opacity="0.25"/></svg>`),
  'marbled-ink': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><filter id="marble"><feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="5" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="35"/></filter><g filter="url(#marble)" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.5"><path d="M 0,20 Q 50,80 100,20 T 200,20"/><path d="M 0,70 Q 60,10 120,80 T 200,70"/><path d="M 0,130 Q 70,180 140,110 T 200,140"/><path d="M 0,180 Q 40,120 100,190 T 200,180"/></g></svg>`),
  'thermal-fax': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="1.2" fill="#ffffff" opacity="0.45"/><rect width="8" height="1" fill="#ffffff" opacity="0.2"/></svg>`),
  'halftone-dots': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5" fill="#ffffff" opacity="0.75"/><circle cx="0" cy="0" r="1.5" fill="#ffffff" opacity="0.45"/><circle cx="20" cy="20" r="1.5" fill="#ffffff" opacity="0.45"/></svg>`),
  'cyber-scanline': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6"><rect width="6" height="3" fill="#ffffff" opacity="0.45"/><rect y="3" width="6" height="3" fill="#000000" opacity="0.45"/></svg>`),
  'blueprint-grid': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-width="0.7" opacity="0.38"/><path d="M 24 0 L 24 48 M 0 24 L 48 24" fill="none" stroke="#ffffff" stroke-width="0.35" stroke-dasharray="2 2" opacity="0.22"/></svg>`),
  'film-grain': encodeSvg(`<svg viewBox="0 0 180 180" width="180" height="180" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.55"/></svg>`),
  'topo-contour': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g fill="none" stroke="#ffffff" stroke-width="1" opacity="0.42"><path d="M-20,40 C40,10 90,80 160,30 C210,-5 240,50 260,30"/><path d="M-20,80 C50,45 100,120 170,65 C215,30 240,85 260,70"/><path d="M-20,125 C60,90 110,165 180,105 C220,70 245,125 260,115"/><path d="M-20,170 C70,135 120,210 190,150 C225,115 245,170 260,160"/><path d="M-20,215 C80,180 130,250 200,195 C230,160 250,215 260,205"/><ellipse cx="120" cy="120" rx="70" ry="38" stroke-dasharray="4 2"/><ellipse cx="120" cy="120" rx="42" ry="20"/></g></svg>`),
  'microfiche-grid': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.3"/><path d="M 0,40 L 8,40 M 72,40 L 80,40 M 40,0 L 40,8 M 40,72 L 40,80" stroke="#ffffff" stroke-width="0.8" opacity="0.45"/><rect x="12" y="12" width="56" height="56" fill="none" stroke="#ffffff" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.25"/></svg>`),
  'ascii-matrix': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="3" y="3" width="6" height="3" fill="#ffffff" opacity="0.38"/><rect x="13" y="3" width="3" height="3" fill="#ffffff" opacity="0.48"/><rect x="21" y="3" width="8" height="3" fill="#ffffff" opacity="0.24"/><rect x="3" y="11" width="3" height="3" fill="#ffffff" opacity="0.28"/><rect x="11" y="11" width="10" height="3" fill="#ffffff" opacity="0.42"/><rect x="25" y="11" width="4" height="3" fill="#ffffff" opacity="0.48"/><rect x="3" y="19" width="8" height="3" fill="#ffffff" opacity="0.38"/><rect x="15" y="19" width="4" height="3" fill="#ffffff" opacity="0.28"/><rect x="23" y="19" width="6" height="3" fill="#ffffff" opacity="0.45"/><rect x="3" y="27" width="4" height="3" fill="#ffffff" opacity="0.32"/><rect x="11" y="27" width="6" height="3" fill="#ffffff" opacity="0.24"/><rect x="21" y="27" width="8" height="3" fill="#ffffff" opacity="0.4"/></svg>`),
  'linen-weave': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path d="M0,3 L12,3 M0,9 L12,9" stroke="#ffffff" stroke-width="0.7" opacity="0.32"/><path d="M3,0 L3,12 M9,0 L9,12" stroke="#ffffff" stroke-width="0.7" opacity="0.28"/><rect x="2" y="2" width="2" height="2" fill="#000000" opacity="0.25"/><rect x="8" y="8" width="2" height="2" fill="#000000" opacity="0.25"/></svg>`),
  'carbon-fiber': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="#090b10" opacity="0.4"/><polygon points="0,0 8,0 8,8 0,8" fill="#ffffff" opacity="0.22"/><polygon points="8,8 16,8 16,16 8,16" fill="#ffffff" opacity="0.22"/><line x1="0" y1="0" x2="16" y2="16" stroke="#000000" stroke-width="1.5" opacity="0.45"/><line x1="8" y1="0" x2="16" y2="8" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/><line x1="0" y1="8" x2="8" y2="16" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/></svg>`),
  'moire-wave': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><g fill="none" stroke="#ffffff" stroke-width="0.85" opacity="0.38"><circle cx="80" cy="80" r="14"/><circle cx="80" cy="80" r="28"/><circle cx="80" cy="80" r="42"/><circle cx="80" cy="80" r="56"/><circle cx="80" cy="80" r="70"/><circle cx="94" cy="80" r="18" opacity="0.7"/><circle cx="94" cy="80" r="36" opacity="0.7"/><circle cx="94" cy="80" r="54" opacity="0.7"/><circle cx="94" cy="80" r="72" opacity="0.7"/></g></svg>`),
  'terrazzo-stone': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><polygon points="15,12 32,8 28,26 12,22" fill="#ffffff" opacity="0.42"/><polygon points="75,18 96,12 92,32 70,28" fill="#ffffff" opacity="0.28"/><polygon points="115,42 132,38 128,58 110,50" fill="#ffffff" opacity="0.32"/><polygon points="28,68 48,60 54,82 24,78" fill="#ffffff" opacity="0.35"/><polygon points="88,75 112,68 106,94 82,88" fill="#ffffff" opacity="0.46"/><polygon points="18,112 42,105 36,128 14,124" fill="#ffffff" opacity="0.3"/><polygon points="64,115 84,108 88,130 60,126" fill="#ffffff" opacity="0.35"/><circle cx="58" cy="36" r="4" fill="#ffffff" opacity="0.35"/><circle cx="122" cy="112" r="6" fill="#ffffff" opacity="0.28"/></svg>`),
  'bauhaus-grid': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><g fill="none" stroke="#ffffff" stroke-width="1" opacity="0.36"><rect x="0" y="0" width="160" height="160"/><line x1="80" y1="0" x2="80" y2="160" opacity="0.6"/><line x1="0" y1="80" x2="160" y2="80" opacity="0.6"/><path d="M 0,80 A 80,80 0 0,1 80,0" stroke-width="1.2"/><path d="M 80,160 A 80,80 0 0,1 160,80" stroke-width="1.2"/></g></svg>`),
  'letterpress-bite': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="cotton"><feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#cotton)" opacity="0.58"/></svg>`),
  'newsprint-halftone': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><circle cx="3.5" cy="3.5" r="1.8" fill="#ffffff" opacity="0.48"/><circle cx="10.5" cy="10.5" r="1.8" fill="#ffffff" opacity="0.48"/><circle cx="10.5" cy="3.5" r="1.1" fill="#ffffff" opacity="0.3"/><circle cx="3.5" cy="10.5" r="1.1" fill="#ffffff" opacity="0.3"/></svg>`),
  'architectural-draft': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="46" viewBox="0 0 80 46"><g fill="none" stroke="#ffffff" stroke-width="0.65" opacity="0.35"><path d="M 0,23 L 40,0 L 80,23 L 40,46 Z"/><line x1="40" y1="0" x2="40" y2="46"/><line x1="0" y1="0" x2="0" y2="46"/></g></svg>`),
  'oscilloscope-harmonic': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><g fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4"><path d="M 0,50 Q 25,5 50,50 T 100,50 T 150,50 T 200,50"/><path d="M 0,50 Q 25,95 50,50 T 100,50 T 150,50 T 200,50" opacity="0.65"/><line x1="0" y1="50" x2="200" y2="50" stroke-width="0.4" stroke-dasharray="3 3"/></g></svg>`),
  'concrete-formwork': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><line x1="0" y1="30" x2="120" y2="30" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/><line x1="0" y1="60" x2="120" y2="60" stroke="#000000" stroke-width="1" opacity="0.35"/><line x1="0" y1="90" x2="120" y2="90" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/><circle cx="30" cy="45" r="2.2" fill="#ffffff" opacity="0.35"/><circle cx="90" cy="45" r="2.2" fill="#ffffff" opacity="0.35"/><circle cx="30" cy="105" r="2.2" fill="#ffffff" opacity="0.35"/><circle cx="90" cy="105" r="2.2" fill="#ffffff" opacity="0.35"/></svg>`),
  'vhs-tracking': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40"><rect y="4" width="100" height="1.5" fill="#ffffff" opacity="0.35"/><rect y="14" width="65" height="2" fill="#ffffff" opacity="0.45"/><rect x="30" y="24" width="70" height="1" fill="#ffffff" opacity="0.3"/><rect y="34" width="100" height="2.5" fill="#000000" opacity="0.4"/></svg>`),
  'japanese-washi': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="#ffffff" stroke-width="0.7" opacity="0.38"><path d="M 10,15 Q 40,5 70,22"/><path d="M 65,45 Q 95,30 115,65"/><path d="M 5,80 Q 35,95 60,70"/><path d="M 45,105 Q 80,115 110,95"/><path d="M 25,40 Q 45,65 20,90"/></g></svg>`),
  'swiss-cross-matrix': encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><path d="M 17,20 L 23,20 M 20,17 L 20,23" stroke="#ffffff" stroke-width="1" opacity="0.45"/></svg>`),
};

// Natural tile size in px for repeating SVG graphic textures (prevents stretching a small SVG tile across the entire poster)
const TEXTURE_TILE_SIZES: Record<string, number> = {
  'distressed-xerox': 160,
  'glitch-matrix': 24,
  'woodcut-hatch': 20,
  'marbled-ink': 200,
  'thermal-fax': 12,
  'halftone-dots': 20,
  'cyber-scanline': 8,
  'blueprint-grid': 48,
  'film-grain': 180,
  'topo-contour': 240,
  'microfiche-grid': 80,
  'ascii-matrix': 36,
  'linen-weave': 16,
  'carbon-fiber': 20,
  'moire-wave': 160,
  'terrazzo-stone': 140,
  'bauhaus-grid': 160,
  'letterpress-bite': 160,
  'newsprint-halftone': 16,
  'architectural-draft': 80,
  'oscilloscope-harmonic': 200,
  'concrete-formwork': 120,
  'vhs-tracking': 120,
  'japanese-washi': 120,
  'swiss-cross-matrix': 40,
};

const TINT_COLORS: Record<string, string> = {
  none: 'transparent',
  green: '#00FF66',
  amber: '#FFB800',
  cyan: '#00E5FF',
  crimson: '#FF3366',
  violet: '#8B5CF6',
  cobalt: '#0051FF',
  'acid-lime': '#CCFF00',
  copper: '#EA580C',
  monochrome: '#FFFFFF',
};

const FRAME_BASE_DIMENSIONS: Record<TypographicState['canvasFrame'], { w: number; h: number }> = {
  poster: { w: 500, h: 700 },      // Classic Swiss A4 proportion (1:1.41)
  square: { w: 540, h: 540 },      // 1:1 Vinyl / Album
  editorial: { w: 520, h: 650 },   // 4:5 Magazine
  broadsheet: { w: 430, h: 730 },  // 9:16 Tall Monolith
  cinema: { w: 680, h: 382 },      // 16:9 Widescreen
  ribbon: { w: 720, h: 300 },      // 21:9 Ultra-wide
  landscape: { w: 680, h: 480 },   // 1.41:1 Swiss Landscape
  fluid: { w: 600, h: 480 },       // 5:4 Fluid Stage
};

const ALL_POSTER_LAYOUTS: PosterLayout[] = [
  'classic-stack',
  'swiss-split',
  'editorial-magazine',
  'brutalist-frame',
  'center-monolith',
  'diagonal-construct',
  'index-catalog',
  'kinetic-banner',
];

export const TypographicCanvas: React.FC<TypographicCanvasProps> = ({
  state,
  onChangeText,
  onChangeSubText,
  onUpdateState,
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
  const currentLayout: PosterLayout = state.posterLayout || 'classic-stack';
  const isWideShortFrame = baseDims.h <= 400; // ribbon (300px) & cinema (382px)
  const isCompactHeight = baseDims.h <= 550; // square (540px), landscape (480px), fluid (480px), cinema (382px), ribbon (300px)
  const tileBaseSize = TEXTURE_TILE_SIZES[state.backgroundTexture];

  // Responsive padding buffer: 24px on desktop, 12px on mobile
  const bufferX = stageSize.width < 640 ? 12 : 24;
  const bufferY = stageSize.height < 640 ? 12 : 24;

  const availableW = Math.max(160, stageSize.width - bufferX);
  const availableH = Math.max(160, stageSize.height - bufferY);

  // Auto-fit scale factor: fits both width and height exactly within available viewport stage
  const autoFitScale = Math.min(availableW / baseDims.w, availableH / baseDims.h);
  
  // Effective scale applied
  const effectiveScale = isFitMode ? autoFitScale : (zoomLevel / 100);

  // Proactive Height-Budget Allocation: guarantees Header + Body + Inline Plate + Subtext + Footer never overlap
  const hasInlinePlate = Boolean(state.showImageLayer && state.imageUrl && state.imagePlacement !== 'background');
  const posterPadY = isWideShortFrame ? 32 : (isCompactHeight && hasInlinePlate ? 36 : 48);
  const posterInnerH = Math.max(200, baseDims.h - posterPadY);
  const headerBudget = state.showHeader !== false ? (isWideShortFrame ? 36 : 46) : 0;
  const footerBudget = state.showFooter !== false ? (isWideShortFrame ? 36 : 46) : 0;
  const subTextBudget = state.showSubText && state.subText ? (isWideShortFrame ? 42 : 64) : 0;
  const layoutChromeBudget = currentLayout === 'brutalist-frame' ? 76 : (currentLayout === 'index-catalog' || currentLayout === 'center-monolith' ? 54 : 28);
  const maxPlateHeight = isWideShortFrame
    ? Math.min(state.imageHeight || 110, Math.round(baseDims.h * 0.36))
    : Math.min(
        state.imageHeight || 170,
        Math.round((posterInnerH - headerBudget - footerBudget) * (currentLayout === 'brutalist-frame' ? 0.27 : 0.32))
      );
  const plateBudget = hasInlinePlate && !(isWideShortFrame && currentLayout === 'classic-stack') ? maxPlateHeight + 28 : 0;
  const lineCount = Math.max(1, (state.text || '').split('\n').length);
  const remainingForHeadline = Math.max(44, posterInnerH - headerBudget - footerBudget - subTextBudget - layoutChromeBudget - plateBudget);
  const maxSafeFontSize = Math.max(22, Math.floor(remainingForHeadline / (lineCount * Math.max(0.92, state.lineHeight) * 1.15)));
  const effectiveFontSize = (hasInlinePlate || currentLayout === 'brutalist-frame' || isCompactHeight)
    ? Math.min(state.fontSize, maxSafeFontSize)
    : state.fontSize;

  const headlineStyle: React.CSSProperties = {
    fontFamily: state.fontFamily,
    fontSize: `${effectiveFontSize}px`,
    fontWeight: state.fontWeight,
    fontStyle: state.isItalic ? 'italic' : 'normal',
    letterSpacing: `${state.letterSpacing}em`,
    lineHeight: state.lineHeight,
    wordSpacing: `${state.wordSpacing}em`,
    textAlign: currentLayout === 'center-monolith' ? 'center' : state.textAlign,
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
    textAlign: currentLayout === 'center-monolith' ? 'center' : state.textAlign,
    lineHeight: isWideShortFrame || (isCompactHeight && hasInlinePlate) ? 1.32 : 1.48,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  // Helper to render inline graphic plates
  const renderInlineImagePlate = (position: 'above' | 'between' | 'below' | 'any') => {
    if (!state.showImageLayer || !state.imageUrl) return null;
    if (position !== 'any' && state.imagePlacement !== position) return null;
    if (position === 'any' && state.imagePlacement === 'background') return null;

    return (
      <div className="w-full my-1 border border-current/25 overflow-hidden relative group shrink-0" style={{ color: state.textColor }}>
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
          <div className="text-[10px] font-mono-code uppercase px-2 py-0.5 bg-black/80 text-[#F4F5F7] border-t border-current/20 flex justify-between items-center">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateState?.({ imageCaption: e.currentTarget.innerText })}
              className="truncate pr-2 focus:outline-none focus:text-[#00FF66] hover:bg-white/10 cursor-text"
              title="Click to edit plate caption"
            >
              {state.imageCaption}
            </span>
            <span
              contentEditable
              suppressContentEditableWarning
              className="shrink-0 font-bold opacity-85 focus:outline-none hover:bg-white/10 cursor-text"
              style={{ color: state.subTextColor || state.textColor }}
              title="Click to edit plate reference tag"
            >
              PLATE // REF
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render Headline Block (Supporting all 6 Kinetic Modes + Direct Editing on all modes)
  const renderHeadlineBlock = () => {
    if (state.kineticMode === 'marquee') {
      return (
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="animate-marquee py-1">
            <span
              style={headlineStyle}
              className="pr-12 inline-block focus:outline-none cursor-text"
              contentEditable
              suppressContentEditableWarning
              onFocus={() => onSelectLayer?.('headline')}
              onBlur={(e) => onChangeText(e.currentTarget.innerText)}
              title="Click directly to edit headline"
            >
              {state.text}
            </span>
            <span style={headlineStyle} className="pr-12 inline-block" aria-hidden="true">{state.text}</span>
          </div>
        </div>
      );
    }
    if (state.kineticMode === 'breath') {
      return (
        <div className="w-full text-center">
          <div
            className="animate-breath inline-block w-full focus:outline-none cursor-text"
            style={headlineStyle}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onSelectLayer?.('headline')}
            onBlur={(e) => onChangeText(e.currentTarget.innerText)}
            title="Click directly to edit headline"
          >
            {state.text}
          </div>
        </div>
      );
    }
    if (state.kineticMode === 'skew-wobble') {
      return (
        <div className="w-full text-center">
          <div
            className="animate-skew-wobble inline-block w-full focus:outline-none cursor-text"
            style={headlineStyle}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onSelectLayer?.('headline')}
            onBlur={(e) => onChangeText(e.currentTarget.innerText)}
            title="Click directly to edit headline"
          >
            {state.text}
          </div>
        </div>
      );
    }
    if (state.kineticMode === 'stagger-split') {
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onSelectLayer?.('headline')}
          onBlur={(e) => onChangeText(e.currentTarget.innerText)}
          className="w-full space-y-1 focus:outline-none cursor-text"
          title="Click directly to edit headline"
        >
          {state.text.split('\n').map((line, idx) => (
            <div
              key={idx}
              style={{
                ...headlineStyle,
                transform: `translateX(${idx % 2 === 0 ? '-10px' : '10px'}) skewX(${state.skew}deg)`,
              }}
              className="w-full transition-transform duration-500 animate-pulse"
            >
              {line}
            </div>
          ))}
        </div>
      );
    }
    if (state.kineticMode === 'glitch-pulse') {
      return (
        <div className="w-full relative">
          <div
            aria-hidden="true"
            className="w-full absolute top-0 left-0 pointer-events-none select-none opacity-65 animate-pulse"
            style={{
              ...headlineStyle,
              color: '#FF2A6D',
              transform: `translate(-3px, -1px) skewX(${state.skew}deg) rotate(${state.rotation}deg)`,
              mixBlendMode: 'screen',
            }}
          >
            {state.text}
          </div>
          <div
            aria-hidden="true"
            className="w-full absolute top-0 left-0 pointer-events-none select-none opacity-65 animate-pulse"
            style={{
              ...headlineStyle,
              color: '#00E5FF',
              transform: `translate(3px, 1px) skewX(${state.skew}deg) rotate(${state.rotation}deg)`,
              mixBlendMode: 'screen',
            }}
          >
            {state.text}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onSelectLayer?.('headline')}
            onBlur={(e) => onChangeText(e.currentTarget.innerText)}
            className="w-full relative z-10 focus:outline-none cursor-text"
            style={headlineStyle}
            title="Click directly to edit headline"
          >
            {state.text}
          </div>
        </div>
      );
    }

    return (
      <div
        className="w-full relative transition-all duration-200"
        onClick={() => onSelectLayer?.('headline')}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onSelectLayer?.('headline')}
          onBlur={(e) => onChangeText(e.currentTarget.innerText)}
          className="w-full focus:outline-none focus:ring-1 focus:ring-[#00FF66]/30 hover:bg-current/5 rounded-none cursor-text transition-all"
          style={headlineStyle}
          title="Click directly to edit headline"
        >
          {state.text}
        </div>
      </div>
    );
  };

  // Render Secondary Pairing Block
  const renderSecondaryBlock = (noTopBorder = false) => {
    if (!state.showSubText || !state.subText) return null;
    return (
      <div
        className={`w-full relative transition-all duration-200 ${noTopBorder ? '' : 'pt-2.5 mt-1.5 border-t border-current/15'}`}
        style={{ borderColor: `${state.textColor}26` }}
        onClick={() => onSelectLayer?.('secondary')}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onSelectLayer?.('secondary')}
          onBlur={(e) => onChangeSubText(e.currentTarget.innerText)}
          className="w-full focus:outline-none focus:ring-1 focus:ring-[#00FF66]/30 hover:bg-current/5 rounded-none cursor-text transition-all"
          style={subTextStyle}
          title="Click directly to edit secondary pairing text"
        >
          {state.subText}
        </div>
      </div>
    );
  };

  const defaultRightTitle = `${state.fontFamily.split(',')[0].replace(/['"]/g, '')}${
    state.showSubText ? ` + ${state.subFontFamily.split(',')[0].replace(/['"]/g, '')}` : ''
  }`;
  const defaultRightSubtitle = `Size: ${state.fontSize}px // Leading: ${state.lineHeight}`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-2 sm:p-3 bg-[#070809] overflow-hidden select-none">
      
      {/* Background subtle laboratory grid */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-25 pointer-events-none" />

      {/* Canvas Top Toolbar & Viewport Controls */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2 pb-2 px-3 sm:px-4 text-xs font-mono-code text-[#A1A1AA] z-10 border-b border-[#1A1F29] mb-1 shrink-0">
        
        {/* Dimensions, Layout, Texture & Quick Header/Footer Toggles */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-hidden">
          <h1 className="flex items-center gap-1 text-[#00FF66] font-bold text-xs uppercase m-0 shrink-0">
            <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse"></span>
            <span className="hidden lg:inline">TYPE//LAB 11</span>
          </h1>
          <span className="text-[#3A4354] hidden lg:inline">|</span>
          <span className="text-xs truncate font-semibold hidden md:inline">[{state.canvasFrame.toUpperCase()}]</span>
          <span className="text-[#3A4354] hidden md:inline">|</span>

          {/* Quick Layout Architecture Cycle Button */}
          <button
            onClick={() => {
              const idx = ALL_POSTER_LAYOUTS.indexOf(currentLayout);
              const next = ALL_POSTER_LAYOUTS[(idx + 1) % ALL_POSTER_LAYOUTS.length];
              onUpdateState?.({ posterLayout: next });
            }}
            className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-[#12161F] hover:bg-[#1A222F] text-[#F4F5F7] hover:text-[#00FF66] border border-[#232B3B] transition-colors text-[11px] font-bold shrink-0"
            title="Cycle poster architectural layout structure"
          >
            <Layout className="w-3 h-3 text-[#00FF66] shrink-0" />
            <span className="hidden sm:inline">LAYOUT:</span>
            <span className="truncate max-w-[48px] sm:max-w-[95px]">{currentLayout.toUpperCase()}</span>
            <span className="text-[#8E97A8] text-[10px]">⇄</span>
          </button>

          {/* Quick Texture Cycle Button */}
          <button
            onClick={() => {
              const textures: Array<TypographicState['backgroundTexture']> = [
                'none', 'photostat', 'darkroom', 'swiss-grid', 'macro-ink', 'risograph',
                'crumpled-paper', 'ferrofluid-bloom', 'brutalist-vault', 'wheatpaste-fold',
                'suminagashi-ink', 'celluloid-burn', 'kraft-collage', 'oxidized-etching',
                'brutalist-facade', 'cyanotype-plate', 'charcoal-frottage', 'wet-collodion',
                'concrete-coffer', 'litho-stone', 'burnt-vellum', 'newsprint-micro',
                'silver-solarize', 'marbled-ink', 'distressed-xerox', 'glitch-matrix',
                'woodcut-hatch', 'thermal-fax', 'halftone-dots', 'cyber-scanline',
                'blueprint-grid', 'film-grain', 'topo-contour', 'microfiche-grid',
                'ascii-matrix', 'linen-weave', 'carbon-fiber', 'moire-wave',
                'terrazzo-stone', 'bauhaus-grid', 'letterpress-bite', 'newsprint-halftone',
                'architectural-draft', 'oscilloscope-harmonic', 'concrete-formwork',
                'vhs-tracking', 'japanese-washi', 'swiss-cross-matrix'
              ];
              const idx = textures.indexOf(state.backgroundTexture);
              const next = textures[(idx + 1) % textures.length];
              onChangeTexture?.(next);
            }}
            className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-[#12161F] hover:bg-[#1A222F] text-[#00FF66] border border-[#232B3B] transition-colors text-[11px] font-bold shrink-0"
            title="Cycle background texture plate"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] hidden sm:inline-block shrink-0"></span>
            <span className="hidden sm:inline">BG:</span>
            <span className="truncate max-w-[48px] sm:max-w-[95px]">{state.backgroundTexture.toUpperCase()}</span>
            <span className="text-[#8E97A8] text-[10px]">⇄</span>
          </button>

          {/* Quick Header / Footer Visibility Toggles */}
          <button
            onClick={() => onUpdateState?.({ showHeader: state.showHeader === false })}
            className={`hidden sm:inline-flex items-center px-1.5 py-0.5 border text-[10px] font-bold transition-colors shrink-0 ${
              state.showHeader !== false
                ? 'border-[#00FF66]/50 bg-[#142319] text-[#00FF66]'
                : 'border-[#232B3B] bg-[#12161F] text-[#758091] hover:text-[#F4F5F7]'
            }`}
            title="Toggle top poster header metadata on/off"
          >
            HDR
          </button>
          <button
            onClick={() => onUpdateState?.({ showFooter: state.showFooter === false })}
            className={`hidden sm:inline-flex items-center px-1.5 py-0.5 border text-[10px] font-bold transition-colors shrink-0 ${
              state.showFooter !== false
                ? 'border-[#00FF66]/50 bg-[#142319] text-[#00FF66]'
                : 'border-[#232B3B] bg-[#12161F] text-[#758091] hover:text-[#F4F5F7]'
            }`}
            title="Toggle bottom poster footer metadata on/off"
          >
            FTR
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
              className={`w-full h-full relative transition-all duration-200 flex flex-col justify-between ${
                isWideShortFrame ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
              } border border-[#262C3A] overflow-hidden shadow-2xl`}
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
                  backgroundSize: tileBaseSize
                    ? (state.textureRepeat === 'contain'
                        ? 'contain'
                        : `${Math.max(6, Math.round(tileBaseSize * ((state.textureScale ?? 100) / 100)))}px`)
                    : (state.textureRepeat === 'repeat'
                        ? `${Math.max(40, Math.round(280 * ((state.textureScale ?? 100) / 100)))}px`
                        : (state.textureRepeat === 'contain' ? 'contain' : 'cover')),
                  backgroundRepeat: (tileBaseSize && state.textureRepeat !== 'contain') || state.textureRepeat === 'repeat'
                    ? 'repeat'
                    : 'no-repeat',
                  backgroundPosition: 'center',
                  transform: (!tileBaseSize && state.textureScale && state.textureScale !== 100 && state.textureRepeat !== 'repeat')
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

          {/* BACKGROUND WATERMARK / SWISS ARCHITECTURAL CHARACTER (Only when explicitly enabled) */}
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

          {/* SUBTLE ARCHITECTURAL GRID OVERLAYS (Uses current text color, never loud neon green) */}
          {state.showGrid && state.gridType === 'modular' && (
            <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 gap-2 p-6 pointer-events-none z-0 opacity-15" style={{ color: state.textColor }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-full border-x border-current/40 bg-current/5" />
              ))}
            </div>
          )}

          {state.showGrid && state.gridType === 'baseline' && (
            <div className="absolute inset-0 swiss-grid-pattern-dense opacity-25 pointer-events-none z-0" />
          )}

          {state.showGrid && state.gridType === 'crosshair' && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-15" style={{ color: state.textColor }}>
              <div className="w-full h-[1px] bg-current" />
              <div className="absolute h-full w-[1px] bg-current" />
              <div className="absolute w-28 h-28 border border-current rounded-full" />
            </div>
          )}

          {state.showGrid && state.gridType === 'golden-ratio' && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ color: state.textColor }}>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="0" y="0" width="61.8" height="100" fill="none" stroke="currentColor" strokeWidth="0.35" />
                <rect x="61.8" y="0" width="38.2" height="61.8" fill="none" stroke="currentColor" strokeWidth="0.35" />
                <rect x="76.4" y="61.8" width="23.6" height="38.2" fill="none" stroke="currentColor" strokeWidth="0.35" />
                <rect x="61.8" y="76.4" width="14.6" height="23.6" fill="none" stroke="currentColor" strokeWidth="0.35" />
                <path d="M 0,100 A 61.8,100 0 0,1 61.8,0 A 38.2,61.8 0 0,1 100,61.8 A 23.6,38.2 0 0,1 76.4,100" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.5 1" />
              </svg>
            </div>
          )}

          {state.showGrid && state.gridType === 'diagonal' && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-15" style={{ color: state.textColor }}>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.35" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.35" />
                <rect x="14.6" y="14.6" width="70.8" height="70.8" fill="none" stroke="currentColor" strokeWidth="0.3" />
              </svg>
            </div>
          )}

          {/* ==================== EDITABLE TOP POSTER HEADER METADATA ==================== */}
          {state.showHeader !== false && (
            <div 
              className={`relative z-10 shrink-0 flex justify-between items-start text-xs font-mono-code ${
                isWideShortFrame ? 'pb-1.5 mb-2' : 'pb-2.5 mb-2.5'
              } ${
                currentLayout === 'diagonal-construct' ? 'border-b-4 border-current' : 'border-b border-current/25'
              }`}
              style={{ color: state.textColor }}
            >
              <div className="flex flex-col max-w-[55%]">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ headerLeftTitle: e.currentTarget.innerText })}
                  className="font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit top-left header title"
                >
                  {state.headerLeftTitle ?? "Type Laboratory Experimental Specimen"}
                </span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ headerLeftSubtitle: e.currentTarget.innerText })}
                  className="opacity-75 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit top-left header subtitle"
                >
                  {state.headerLeftSubtitle ?? "Series: Kinetic Swiss Modernism"}
                </span>
              </div>
              <div className="text-right flex flex-col items-end max-w-[45%]">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ headerRightTitle: e.currentTarget.innerText })}
                  className="font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit top-right header title"
                >
                  {state.headerRightTitle || defaultRightTitle}
                </span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ headerRightSubtitle: e.currentTarget.innerText })}
                  className="opacity-75 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit top-right header subtitle"
                >
                  {state.headerRightSubtitle || defaultRightSubtitle}
                </span>
              </div>
            </div>
          )}

          {/* ==================== ARCHITECTURAL POSTER BODY (8 LAYOUT MODES — ZERO-OVERFLOW SHRINK-0) ==================== */}
          <div 
            ref={textContainerRef}
            className="relative z-10 shrink-0 my-auto flex flex-col justify-center w-full py-1"
            style={{ color: state.textColor }}
          >
            {/* LAYOUT 1: CLASSIC SWISS STACK (Auto horizontal split on wide short ribbon/cinema frames with plate) */}
            {currentLayout === 'classic-stack' && (
              isWideShortFrame && state.showImageLayer && state.imageUrl && state.imagePlacement !== 'background' ? (
                <div className="grid grid-cols-12 gap-4 items-center w-full my-auto">
                  <div className="col-span-7 flex flex-col justify-center space-y-1.5">
                    {renderHeadlineBlock()}
                    {renderSecondaryBlock()}
                  </div>
                  <div className="col-span-5">
                    {renderInlineImagePlate('any')}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center w-full space-y-2.5">
                  {renderInlineImagePlate('above')}
                  {renderHeadlineBlock()}
                  {renderInlineImagePlate('between')}
                  {renderSecondaryBlock()}
                  {renderInlineImagePlate('below')}
                </div>
              )
            )}

            {/* LAYOUT 2: ASYMMETRIC SWISS SPLIT (2-COLUMN RASTER) */}
            {currentLayout === 'swiss-split' && (
              <div className="grid grid-cols-12 gap-4 w-full items-stretch my-auto py-1">
                <div className="col-span-4 border-r border-current/25 pr-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="text-[10px] font-mono-code uppercase tracking-wider opacity-70 border-b border-current/20 pb-1 focus:outline-none hover:bg-current/10 cursor-text"
                      title="Click to edit section label"
                    >
                      01 // INDEX & NOTES
                    </div>
                    {renderSecondaryBlock(true)}
                  </div>
                  <div className="pt-2 border-t border-current/20 text-[10px] font-mono-code opacity-65 space-y-0.5">
                    <div contentEditable suppressContentEditableWarning className="focus:outline-none hover:bg-current/10 cursor-text">GRID // 12-COL ASYMMETRIC</div>
                    <div contentEditable suppressContentEditableWarning className="focus:outline-none hover:bg-current/10 cursor-text">SCALE // {effectiveFontSize}PX : {state.subFontSize}PX</div>
                  </div>
                </div>
                <div className="col-span-8 pl-1 flex flex-col justify-between space-y-2">
                  {renderInlineImagePlate('above')}
                  <div className="my-auto">{renderHeadlineBlock()}</div>
                  {renderInlineImagePlate('between')}
                  {renderInlineImagePlate('below')}
                </div>
              </div>
            )}

            {/* LAYOUT 3: EDITORIAL MAGAZINE MONOGRAPH */}
            {currentLayout === 'editorial-magazine' && (
              <div className="flex flex-col justify-between w-full space-y-2.5 py-1">
                <div className="w-full pb-2 border-b-2 border-current/30">
                  {renderHeadlineBlock()}
                </div>
                <div className="grid grid-cols-12 gap-4 items-start pt-1 my-auto">
                  <div className={state.showImageLayer && state.imagePlacement !== 'background' ? 'col-span-6 pr-2 border-r border-current/20' : 'col-span-12'}>
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="text-[10px] font-mono-code uppercase opacity-65 mb-1 focus:outline-none hover:bg-current/10 cursor-text"
                      title="Click to edit section label"
                    >
                      EDITORIAL FOLIO // ESSAY
                    </div>
                    {renderSecondaryBlock(true)}
                  </div>
                  {state.showImageLayer && state.imagePlacement !== 'background' && (
                    <div className="col-span-6">
                      {renderInlineImagePlate('any')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LAYOUT 4: BRUTALIST COMPARTMENT BOX GRID */}
            {currentLayout === 'brutalist-frame' && (
              <div className="w-full border-2 border-current/40 divide-y-2 divide-current/40 my-auto">
                <div className="px-3 py-1 flex items-center justify-between text-[10px] font-mono-code uppercase bg-current/5">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="focus:outline-none hover:bg-current/10 cursor-text"
                    title="Click to edit compartment header"
                  >
                    COMPARTMENT // A — PRIMARY DISPLAY
                  </span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="focus:outline-none hover:bg-current/10 cursor-text"
                    title="Click to edit weight label"
                  >
                    [{state.fontWeight} WT]
                  </span>
                </div>
                <div className={isWideShortFrame || (isCompactHeight && hasInlinePlate) ? 'p-2.5' : 'p-3.5'}>
                  {renderHeadlineBlock()}
                </div>
                {state.showImageLayer && state.imagePlacement !== 'background' && (
                  <div className="p-2 bg-current/5">
                    {renderInlineImagePlate('any')}
                  </div>
                )}
                {state.showSubText && state.subText && (
                  <div className="p-2.5 grid grid-cols-12 gap-3 items-start">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="col-span-3 text-[10px] font-mono-code uppercase opacity-75 border-r border-current/25 pr-2 focus:outline-none hover:bg-current/10 cursor-text"
                      title="Click to edit section label"
                    >
                      SEC // 02<br />CAPTION
                    </div>
                    <div className="col-span-9">
                      {renderSecondaryBlock(true)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LAYOUT 5: CENTERED GALLERY MONOLITH */}
            {currentLayout === 'center-monolith' && (
              <div className="flex flex-col items-center justify-center text-center w-full space-y-2 my-auto px-4">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="px-3 py-0.5 border border-current/40 text-[10px] font-mono-code uppercase tracking-widest focus:outline-none hover:bg-current/10 cursor-text"
                  title="Click to edit monolith badge"
                >
                  EXHIBITION MONOLITH // {state.canvasFrame.toUpperCase()}
                </div>
                {renderInlineImagePlate('above')}
                {renderHeadlineBlock()}
                {renderInlineImagePlate('between')}
                <div className="w-16 h-[2px] bg-current opacity-40 my-0.5" />
                <div className="max-w-[88%]">
                  {renderSecondaryBlock(true)}
                </div>
                {renderInlineImagePlate('below')}
              </div>
            )}

            {/* LAYOUT 6: CONSTRUCTIVIST TENSION */}
            {currentLayout === 'diagonal-construct' && (
              <div className="flex flex-col justify-between w-full space-y-2.5 my-auto">
                <div className="border-l-4 border-current pl-4 py-1">
                  {renderHeadlineBlock()}
                </div>
                {renderInlineImagePlate('any')}
                {state.showSubText && state.subText && (
                  <div className="p-2.5 border-y-2 border-current/40 bg-current/5">
                    {renderSecondaryBlock(true)}
                  </div>
                )}
              </div>
            )}

            {/* LAYOUT 7: ARCHIVAL SPECIMEN SHEET (INDEX CATALOG) */}
            {currentLayout === 'index-catalog' && (
              <div className="w-full border-t border-current/35 divide-y divide-current/25 my-auto">
                <div className="py-2 grid grid-cols-12 gap-2 items-baseline">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="col-span-2 text-[10px] font-mono-code opacity-65 focus:outline-none hover:bg-current/10 cursor-text"
                  >
                    01 // TYPE
                  </span>
                  <div className="col-span-10">{renderHeadlineBlock()}</div>
                </div>
                {state.showImageLayer && state.imagePlacement !== 'background' && (
                  <div className="py-2 grid grid-cols-12 gap-2 items-center">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="col-span-2 text-[10px] font-mono-code opacity-65 focus:outline-none hover:bg-current/10 cursor-text"
                    >
                      02 // PLATE
                    </span>
                    <div className="col-span-10">{renderInlineImagePlate('any')}</div>
                  </div>
                )}
                {state.showSubText && state.subText && (
                  <div className="py-2 grid grid-cols-12 gap-2 items-baseline">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="col-span-2 text-[10px] font-mono-code opacity-65 focus:outline-none hover:bg-current/10 cursor-text"
                    >
                      03 // NOTE
                    </span>
                    <div className="col-span-10">{renderSecondaryBlock(true)}</div>
                  </div>
                )}
              </div>
            )}

            {/* LAYOUT 8: FULL-BLEED HORIZONTAL BANDS */}
            {currentLayout === 'kinetic-banner' && (
              <div className="flex flex-col justify-between w-full space-y-2.5 my-auto">
                <div className="py-1.5 border-y-2 border-current">
                  {renderHeadlineBlock()}
                </div>
                {renderInlineImagePlate('any')}
                {state.showSubText && state.subText && (
                  <div className="px-3 py-1.5 border border-current/30">
                    {renderSecondaryBlock(true)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== EDITABLE BOTTOM POSTER FOOTER METADATA ==================== */}
          {state.showFooter !== false && (
            <div 
              className={`relative z-10 shrink-0 flex justify-between items-end text-xs font-mono-code ${
                isWideShortFrame ? 'pt-1.5 mt-2' : 'pt-2.5 mt-2.5'
              } ${
                currentLayout === 'diagonal-construct' ? 'border-t-4 border-current' : 'border-t border-current/25'
              }`}
              style={{ color: state.textColor }}
            >
              <div className="flex flex-col space-y-0.5 max-w-[65%]">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ footerLeftTitle: e.currentTarget.innerText })}
                  className="font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit bottom-left footer title"
                >
                  {state.footerLeftTitle ?? "Allgemeine Gewerbeschule Basel // Zürich Tonhalle"}
                </span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ footerLeftSubtitle: e.currentTarget.innerText })}
                  className="opacity-75 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit bottom-left footer subtitle"
                >
                  {state.footerLeftSubtitle ?? "Type Playground Digital Specimen Engine"}
                </span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateState?.({ footerRightBadge: e.currentTarget.innerText })}
                  className="inline-block px-2 py-0.5 border border-current text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00FF66]/40 hover:bg-current/10 cursor-text"
                  title="Click directly to edit bottom-right specimen badge"
                >
                  {state.footerRightBadge ?? "Specimen Fig. 11-A"}
                </span>
              </div>
            </div>
          )}

            </div>
          </div>
        </div>
      </div>

      {/* Bottom coordinate note */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-1.5 px-5 sm:px-6 text-[11px] font-mono-code text-[#758091] shrink-0 border-t border-[#161B24]">
        <span className="truncate">DIN 476 Modular System Standard // Click any poster text, header, or footer to edit</span>
        <span className="hidden sm:inline shrink-0">X: 000.00mm // Y: 000.00mm</span>
      </div>

    </div>
  );
};
