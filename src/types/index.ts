export type FontCategory = 'grotesk' | 'monospace' | 'serif' | 'display' | 'experimental';

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

export type KineticMode = 'none' | 'marquee' | 'breath' | 'skew-wobble' | 'stagger-split';

export type CanvasFrame = 'poster' | 'square' | 'ribbon' | 'editorial' | 'fluid';

export type GridOverlayType = 'modular' | 'baseline' | 'crosshair' | 'none';

export interface TypographicState {
  text: string;
  fontFamily: string; // CSS family name or ID
  fontSize: number; // 10 to 240
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
