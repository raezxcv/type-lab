import type { AnatomyPoint } from '../types';

export const ANATOMY_POINTS: AnatomyPoint[] = [
  {
    id: 'cap-height',
    label: 'Cap Height',
    term: 'Capital Height (H-Line)',
    definition: 'The distance from the baseline to the top of flat capital letters (such as H, I, E). Curved letters like O or rounded tops often extend slightly above (overshoot) to appear optically equal.',
    xPercent: 18,
    yPercent: 12,
    significance: 'Governs visual hierarchy and title impact across Swiss grid systems.'
  },
  {
    id: 'ascender',
    label: 'Ascender Line',
    term: 'Ascender',
    definition: 'The portion of a lowercase letter (like b, d, f, h, k, l, t) that extends above the mean line (x-height). Often reaches slightly above the cap height in humanist types.',
    xPercent: 44,
    yPercent: 8,
    significance: 'Critical for word-shape recognition and horizontal reading cadence.'
  },
  {
    id: 'x-height',
    label: 'x-Height (Mean Line)',
    term: 'Corpus Size / Mean Line',
    definition: 'The vertical height of lowercase letters with no ascenders or descenders (e.g., x, o, v, a, c). A taller x-height allows smaller point sizes to remain legible on low-resolution displays.',
    xPercent: 62,
    yPercent: 34,
    significance: 'The single most influential metric determining legibility at small screen sizes.'
  },
  {
    id: 'baseline',
    label: 'Baseline',
    term: 'The Typographic Ground Plane',
    definition: 'The invisible horizontal line upon which all characters sit and below which descenders extend. The fundamental anchor of multi-column editorial grid alignment.',
    xPercent: 78,
    yPercent: 70,
    significance: 'Strict adherence to an 8px or 12px baseline grid creates structural cohesion across complex pages.'
  },
  {
    id: 'descender',
    label: 'Descender Line',
    term: 'Descender',
    definition: 'The stroke of a lowercase letter (like g, j, p, q, y) that projects below the baseline.',
    xPercent: 32,
    yPercent: 92,
    significance: 'Requires adequate leading (line-height) to prevent collisions with ascenders on lines below.'
  },
  {
    id: 'counter',
    label: 'Counter / Aperture',
    term: 'Negative Space (Internal & External)',
    definition: 'The enclosed or partially enclosed negative space within letters (like o, p, d, e, c). An open aperture prevents inking fill-in in high-speed print and enhances digital legibility.',
    xPercent: 50,
    yPercent: 48,
    significance: 'Typography is as much about carving negative space as drawing black strokes.'
  },
  {
    id: 'stem',
    label: 'Main Stem',
    term: 'Primary Vertical Stroke',
    definition: 'The principal vertical or near-vertical stroke of a character (like T, L, I, k).',
    xPercent: 88,
    yPercent: 40,
    significance: 'Carries the visual weight and optical density of the font family.'
  }
];
