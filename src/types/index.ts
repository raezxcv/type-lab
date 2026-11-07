export type FontCategory = 'grotesk' | 'monospace' | 'serif' | 'display' | 'experimental' | 'custom';

export interface FontDefinition {
  id: string;
  name: string;
  cssFamily: string;
  category: FontCategory;
  weights: number[];
  origin: string;
  designer: string;
  bestUse: string;
  sampleText: string;
}

export interface FontPairing {
  id: string;
  name: string;
  category: 'Modernist Swiss' | 'Editorial Serif' | 'Cyber Brutalist' | 'Industrial Minimal' | 'Classical Roman';
  description: string;
  headlineFontId: string;
  headlineFamily: string;
  headlineWeight: number;
  headlineTracking: number;
  bodyFontId: string;
  bodyFamily: string;
  bodyWeight: number;
  bodyTracking: number;
  headlineSample: string;
  bodySample: string;
}

export type KineticMode = 'none' | 'marquee' | 'breath' | 'skew-wobble' | 'stagger-split';

export type CanvasFrame = 'poster' | 'square' | 'ribbon' | 'editorial' | 'fluid';

export type GridOverlayType = 'modular' | 'baseline' | 'crosshair' | 'none';

export type TextureId = 
  | 'none'
  | 'photostat'
  | 'darkroom'
  | 'swiss-grid'
  | 'macro-ink'
  | 'risograph'
  | 'crumpled-paper'
  | 'marbled-ink'
  | 'distressed-xerox'
  | 'glitch-matrix'
  | 'woodcut-hatch'
  | 'thermal-fax'
  | 'halftone-dots'
  | 'cyber-scanline'
  | 'blueprint-grid'
  | 'film-grain';

export type TextureBlendMode = 
  | 'normal' 
  | 'overlay' 
  | 'screen' 
  | 'multiply' 
  | 'hard-light' 
  | 'soft-light' 
  | 'difference' 
  | 'color-dodge';

export type TextureTint = 'none' | 'green' | 'amber' | 'cyan' | 'monochrome' | 'crimson';

export interface TypographicState {
  text: string;
  subText: string; // Secondary pairing text
  showSubText: boolean; // Toggle secondary pairing text layer
  subFontFamily: string; // Pairing font family
  subFontSize: number;
  subFontWeight: number;
  subLetterSpacing: number;
  subTextColor: string;

  fontFamily: string; // CSS family name
  fontSize: number; // 12 to 240
  fontWeight: number; // 100 to 900
  isItalic: boolean;
  letterSpacing: number; // -0.1 to 0.8 in em
  lineHeight: number; // 0.6 to 2.5
  wordSpacing: number; // -0.5 to 2.0 in em
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textColor: string;
  backgroundColor: string;
  strokeWidth: number; // 0 to 8 px
  strokeColor: string;
  isVertical: boolean;
  skew: number; // -45 to 45 deg
  rotation: number; // -180 to 180 deg
  kineticMode: KineticMode;
  canvasFrame: CanvasFrame;
  showGrid: boolean;
  gridType: GridOverlayType;
  opacity: number; // 0.1 to 1.0
  textShadow: boolean;
  shadowGlowColor: string;

  // Visual Watermark Character (Swiss architectural layer)
  showWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number;
  watermarkSize: number;

  // Original Graphic Texture & Modifiers
  backgroundTexture: TextureId;
  textureOpacity: number; // 0.05 to 1.0
  textureBlendMode: TextureBlendMode;
  textureScale: number; // 50 to 250%
  textureContrast: number; // 50 to 250%
  textureBrightness: number; // 30 to 200%
  textureBlur: number; // 0 to 15px
  textureInvert: boolean;
  textureTint: TextureTint;
  textureRepeat: 'cover' | 'repeat' | 'contain';

  // Graphic Image Plate Layer (Background or Same layer with texts)
  showImageLayer: boolean;
  imageUrl: string;
  imagePlacement: 'background' | 'between' | 'above' | 'below';
  imageOpacity: number; // 0.1 to 1.0
  imageBlendMode: 'normal' | 'screen' | 'overlay' | 'multiply' | 'luminosity';
  imageHeight: number; // 120 to 360 px
  imageFilter: 'none' | 'grayscale' | 'duotone' | 'invert' | 'high-contrast';
  imageCaption: string; // e.g. "Fig. 11 // Structural Matrix"
  imageFit: 'cover' | 'contain';
}

export interface SpecimenPreset {
  id: string;
  name: string;
  code: string;
  category: 'Modernist Swiss' | 'Cyber Brutalist' | 'Kinetic / Experimental' | 'Editorial Pairing' | 'Monospace Telemetry';
  description: string;
  historicalContext: string;
  recommendedPairing?: string;
  state: TypographicState;
}

export interface AnatomyPoint {
  id: string;
  label: string;
  term: string;
  definition: string;
  xPercent: number;
  yPercent: number;
  significance: string;
}

export interface GlossaryTerm {
  term: string;
  category: 'Metrics' | 'Anatomy' | 'Typesetting' | 'Digital Typography';
  definition: string;
  etymologyOrContext: string;
  formulaOrRule?: string;
}
