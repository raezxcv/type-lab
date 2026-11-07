export interface SpecimenItem {
  id: string;
  catalogId: string;
  title: string;
  subtitle: string;
  category: 'Grotesk' | 'Monospace' | 'Pairing' | 'Kinetic' | 'Experimental';
  primaryFontId: string;
  primaryFontName: string;
  secondaryFontId: string;
  secondaryFontName: string;
  headline: string;
  subhead: string;
  bodySnippet: string;
  metadata: {
    pointSize: number;
    weight: number;
    leading: number;
    tracking: number;
    contrast: string;
    alignment: 'left' | 'center' | 'right';
  };
  palette: {
    bg: string;
    text: string;
    accent: string;
    border: string;
  };
  openTypeHighlights: string[];
  historicalNotes: string;
  glyphSample: string;
}

export const CURATED_SPECIMENS: SpecimenItem[] = [
  {
    id: 'specimen-neue-ordnung',
    catalogId: 'SPEC_2026/01',
    title: 'NEUE ORDNUNG',
    subtitle: 'Systemic Modularity & Grid Precision',
    category: 'Grotesk',
    primaryFontId: 'plus-jakarta',
    primaryFontName: 'Plus Jakarta Sans',
    secondaryFontId: 'jetbrains-mono',
    secondaryFontName: 'JetBrains Mono',
    headline: 'RASTER SYSTEME',
    subhead: 'The International Typographic Style (1950–1970)',
    bodySnippet: 'The grid makes it possible to bring all the elements of graphic design — typography, imagery, graphic symbols and color — into an intellectually and visually unified composition. Order is the prerequisite of optical clarity.',
    metadata: {
      pointSize: 76,
      weight: 800,
      leading: 0.9,
      tracking: -0.04,
      contrast: 'Ultra Heavy Headline / Feather Light Body',
      alignment: 'left'
    },
    palette: {
      bg: '#070809',
      text: '#F4F5F7',
      accent: '#00FF66',
      border: '#1F242D'
    },
    openTypeHighlights: ['Stylistic Alternates [ss01]', 'Tabular Figures [tnum]', 'Slashed Zero [zero]'],
    historicalNotes: 'Directly follows Josef Müller-Brockmann’s 1961 thesis on modular column grids for concert posters at the Zurich Tonhalle.',
    glyphSample: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789 §&%#@!'
  },
  {
    id: 'specimen-telemetry-protocol',
    catalogId: 'SPEC_2026/02',
    title: 'TELEMETRY CALIBRATION',
    subtitle: 'Monospaced Instrumentation for Vector Displays',
    category: 'Monospace',
    primaryFontId: 'jetbrains-mono',
    primaryFontName: 'JetBrains Mono',
    secondaryFontId: 'space-mono',
    secondaryFontName: 'Space Mono',
    headline: 'FREQUENCY 1420.4 MHz',
    subhead: 'Hydrogen Line Baseline Monitoring Protocol',
    bodySnippet: 'Monospaced typography ensures absolute horizontal and vertical coordinate alignment across digital data matrices. Each glyph occupies exactly 600 units of em-space, transforming alphanumeric prose into architectural columns.',
    metadata: {
      pointSize: 46,
      weight: 600,
      leading: 1.2,
      tracking: 0.2,
      contrast: 'Uniform Monoline Monospace',
      alignment: 'left'
    },
    palette: {
      bg: '#0A0D10',
      text: '#00FF66',
      accent: '#FFFFFF',
      border: '#00FF6640'
    },
    openTypeHighlights: ['Code Ligatures (->, !=, ===)', 'Slashed Zero', 'Contextual Alternates'],
    historicalNotes: 'Simulates the telemetry readouts of cold-war radio astronomy and cathode ray tube vector instrumentation.',
    glyphSample: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ []{}<>/\\|!@#$%^&*()_+'
  },
  {
    id: 'specimen-didone-subversion',
    catalogId: 'SPEC_2026/03',
    title: 'DIDONE SUBVERSION',
    subtitle: 'High-Contrast Transitional Serif Meets Machine Monospace',
    category: 'Pairing',
    primaryFontId: 'playfair',
    primaryFontName: 'Playfair Display',
    secondaryFontId: 'jetbrains-mono',
    secondaryFontName: 'JetBrains Mono',
    headline: 'Sensibility & Iron',
    subhead: 'A study in optical stroke tension (1:12 thick-to-thin ratio)',
    bodySnippet: 'When the dramatic vertical axis and razor-thin hairline serifs of transitional Didone letterforms are framed by cold monospace technical captions, an intense friction arises between humanist literary romance and technological brutality.',
    metadata: {
      pointSize: 68,
      weight: 900,
      leading: 0.96,
      tracking: -0.02,
      contrast: '12:1 Optical Stroke Contrast',
      alignment: 'left'
    },
    palette: {
      bg: '#08080A',
      text: '#FFFFFF',
      accent: '#FFB800',
      border: '#282830'
    },
    openTypeHighlights: ['Discretionary Ligatures [dlig]', 'Oldstyle Figures [onum]', 'Swash Alternates [swsh]'],
    historicalNotes: 'Synthesizes Giambattista Bodoni (Parma, 1788) with 1990s experimental editorial layout.',
    glyphSample: 'Qu fi fl ct st & æ œ ÀÁÂÃÄÅ ÈÉÊË ÌÍÎÏ ÒÓÔÕÖ ÙÚÛÜ Ý'
  },
  {
    id: 'specimen-kinetic-hyperboloid',
    catalogId: 'SPEC_2026/04',
    title: 'KINETIC HYPERBOLOID',
    subtitle: 'Variable Weight Morphing & Continuous Waveform',
    category: 'Kinetic',
    primaryFontId: 'syne',
    primaryFontName: 'Syne',
    secondaryFontId: 'space-grotesk',
    secondaryFontName: 'Space Grotesk',
    headline: 'EXPANSIVE RHYTHM',
    subhead: 'Dynamic Axis Velocity & Realtime Glyph Interpolation',
    bodySnippet: 'Static typography captures a single frozen state of meaning. Kinetic typography treats letterforms as living vector nodes capable of elasticity, breathing, phase shifts, and acoustic resonance.',
    metadata: {
      pointSize: 62,
      weight: 800,
      leading: 0.88,
      tracking: 0.1,
      contrast: 'Dynamic Inktrap Expansion',
      alignment: 'center'
    },
    palette: {
      bg: '#08090C',
      text: '#00FF66',
      accent: '#FFFFFF',
      border: '#00FF6660'
    },
    openTypeHighlights: ['Variable Weight Axis (400->800)', 'Wide Glyph Variants', 'Custom Inktraps'],
    historicalNotes: 'Born out of the digital vanguard exploring variable font axes (wght, wdth, slnt) in responsive web canvases.',
    glyphSample: 'SYNAPSE VELOCITY MORPH DYNAMICS 0123456789'
  },
  {
    id: 'specimen-concrete-poetry',
    catalogId: 'SPEC_2026/05',
    title: 'DECONSTRUCTED FIELD',
    subtitle: 'Asymmetric Monospace & Broken Reading Paths',
    category: 'Experimental',
    primaryFontId: 'major-mono',
    primaryFontName: 'Major Mono Display',
    secondaryFontId: 'plus-jakarta',
    secondaryFontName: 'Plus Jakarta Sans',
    headline: 'NoN-LiNeAR vEcToR',
    subhead: 'Challenging the Western Horizontal Baseline',
    bodySnippet: 'Letters are primarily visual signs before they are acoustic symbols. By breaking uniform case rules and shifting optical counter weights, reading slows down and the eye re-encounters typography as raw architecture.',
    metadata: {
      pointSize: 52,
      weight: 400,
      leading: 1.1,
      tracking: 0.12,
      contrast: 'Alternating Case Geometry',
      alignment: 'left'
    },
    palette: {
      bg: '#060708',
      text: '#E2E8F0',
      accent: '#00FF66',
      border: '#1E232B'
    },
    openTypeHighlights: ['Unicase Alternates', 'Geometric Monospace', 'Optical Equalization'],
    historicalNotes: 'Draws upon the Dadaist phonetic poetry of Hugo Ball and Kurt Schwitters’ Merzbau typographic collages.',
    glyphSample: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ 1234567890 :.;?!'
  },
  {
    id: 'specimen-monumental-lapidary',
    catalogId: 'SPEC_2026/06',
    title: 'LAPIDARY MAJESTY',
    subtitle: 'Imperial Capital Architecture & Extreme Tracking',
    category: 'Grotesk',
    primaryFontId: 'cinzel',
    primaryFontName: 'Cinzel',
    secondaryFontId: 'space-mono',
    secondaryFontName: 'Space Mono',
    headline: 'IMPERIVM VECTORE',
    subhead: 'Geometric Proportions of the Trajan Alphabet (114 CE)',
    bodySnippet: 'Carved in marble with brush-drawn preliminary strokes, Trajan capitals represent the golden ratio of Roman inscriptional letters: the square (O, D, C), the half-square (E, F, L), and the intermediate harmonics.',
    metadata: {
      pointSize: 44,
      weight: 700,
      leading: 1.35,
      tracking: 0.38,
      contrast: 'Geometric Classical Balance',
      alignment: 'center'
    },
    palette: {
      bg: '#0A0A0C',
      text: '#F8FAFC',
      accent: '#FFB800',
      border: '#2A2A35'
    },
    openTypeHighlights: ['Small Capitals [smcp]', 'All Small Caps [c2sc]', 'Roman Numerals'],
    historicalNotes: 'Based on the brush-written imperial carvings on the pedestal of Trajan’s Column in Rome.',
    glyphSample: 'SENATVS POPVLVSQVE ROMANVS IMP CAESARI NERVAE'
  }
];

