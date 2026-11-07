import type { FontDefinition } from '../types';

export const AVAILABLE_FONTS: FontDefinition[] = [
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    cssFamily: "'Space Grotesk', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700],
    origin: 'Florian Karsten (2018), based on Space Mono',
    designer: 'Florian Karsten',
    bestUse: 'High-impact display headlines, technical captions, brutalist posters',
    sampleText: 'FORM FOLLOWS FUNCTION FOLLOWS FORM'
  },
  {
    id: 'syne',
    name: 'Syne',
    cssFamily: "'Syne', sans-serif",
    category: 'grotesk',
    weights: [400, 500, 600, 700, 800],
    origin: 'Bonjour Monde & Lucas Descroix for the Art Center "Synesthésie"',
    designer: 'Lucas Descroix, Bonjour Monde',
    bestUse: 'Avant-garde editorial, aggressive expansive titles, ultra-bold branding',
    sampleText: 'KINETIC SYNAPSES OF CONTEMPORARY TYPE'
  },
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    cssFamily: "'Plus Jakarta Sans', sans-serif",
    category: 'grotesk',
    weights: [200, 300, 400, 500, 600, 700, 800],
    origin: 'Tokotype (2020), modern geometric neo-grotesque',
    designer: 'Gumpita Rahayu',
    bestUse: 'Swiss modernist grids, high-density editorial body, clean data visualization',
    sampleText: 'INTERNATIONAL TYPOGRAPHIC STYLE // VOL. 11'
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    cssFamily: "'JetBrains Mono', monospace",
    category: 'monospace',
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    origin: 'JetBrains (Philipp Nurullin, Konstantin Bulenkov)',
    designer: 'Philipp Nurullin',
    bestUse: 'Telemetry telemetry, code specimens, metric coordinates, monospace calibration',
    sampleText: '0123456789 [KERNING: METRIC // TRACK: +0.22em]'
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    cssFamily: "'Space Mono', monospace",
    category: 'monospace',
    weights: [400, 700],
    origin: 'Colophon Foundry for Google Design',
    designer: 'Colophon Foundry',
    bestUse: '1960s space race editorial, headline monospace, retro-futuristic data tags',
    sampleText: 'LAT: 47.3769° N, LON: 8.5417° E (ZÜRICH)'
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    cssFamily: "'Cinzel', serif",
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Natanael Gama, inspired by classical Roman inscriptional capitals',
    designer: 'Natanael Gama',
    bestUse: 'High-contrast modern monumentalism, luxury editorial, subversive classical contrast',
    sampleText: 'MONUMENTAL ARCHITECTURE OF THE LETTER'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    cssFamily: "'Playfair Display', serif",
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Claus Eggers Sørensen, transitional Enlightenment typography (Didot / Bodoni)',
    designer: 'Claus Eggers Sørensen',
    bestUse: 'Acid editorial, high stroke contrast, dramatic fashion and art monograph titles',
    sampleText: 'The Elegance of Optical Tension & Contrast'
  },
  {
    id: 'bebas-neue',
    name: 'Bebas Neue',
    cssFamily: "'Bebas Neue', sans-serif",
    category: 'display',
    weights: [400],
    origin: 'Ryoichi Tsunekawa (Dharma Type), condensed display grotesque',
    designer: 'Ryoichi Tsunekawa',
    bestUse: 'Massive vertical posters, billboard scale, compact horizontal compression',
    sampleText: 'MASSIVE COMPRESSED INDUSTRIAL GROTESQUE'
  },
  {
    id: 'major-mono',
    name: 'Major Mono Display',
    cssFamily: "'Major Mono Display', monospace",
    category: 'experimental',
    weights: [400],
    origin: 'Emila Studios, geometric deconstructed monospaced typeface',
    designer: 'Emila Studios',
    bestUse: 'Deconstructed concrete poetry, experimental cyber glyphs, avant-garde titles',
    sampleText: 'DeCoNsTrUcTeD MoNoSpAcE ExPeRiMeNt'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    cssFamily: "'Outfit', sans-serif",
    category: 'grotesk',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    origin: 'Outfit.io design team & Roderick Cavazos',
    designer: 'Roderick Cavazos',
    bestUse: 'Ultra-clean geometric sans, wide round counters, modern digital interfaces',
    sampleText: 'PRECISION GEOMETRY IN VECTOR SPACE'
  },
  {
    id: 'unifraktur',
    name: 'UnifrakturMaguntia',
    cssFamily: "'UnifrakturMaguntia', serif",
    category: 'experimental',
    weights: [400],
    origin: 'J. ‘Mach’ Wust, based on Peter Wiegel’s Mainz Fraktur',
    designer: 'J. ‘Mach’ Wust',
    bestUse: 'Brutalist cyber-gothic contrast, high-fashion subversion, metallic badge lettering',
    sampleText: 'Gothic Digital Alchemy & Modernism'
  }
];
