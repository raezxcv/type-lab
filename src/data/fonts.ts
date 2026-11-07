import type { FontDefinition } from '../types';

export const AVAILABLE_FONTS: FontDefinition[] = [
  // --- GROTESQUE & NEO-GROTESQUE ---
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
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    cssFamily: "'Plus Jakarta Sans', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800],
    origin: 'Tokotype (2020), modern geometric neo-grotesque',
    designer: 'Gumpita Rahayu',
    bestUse: 'Swiss modernist grids, high-density editorial body, clean data visualization',
    sampleText: 'INTERNATIONAL TYPOGRAPHIC STYLE // VOL. 11'
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
    id: 'inter',
    name: 'Inter',
    cssFamily: "'Inter', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Rasmus Andersson (2016), ultra-refined interface grotesque',
    designer: 'Rasmus Andersson',
    bestUse: 'Neutral modernist copy, high-legibility UI, systematic grid alignment',
    sampleText: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    cssFamily: "'Outfit', sans-serif",
    category: 'grotesk',
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    origin: 'Outfit.io design team & Roderick Cavazos',
    designer: 'Roderick Cavazos',
    bestUse: 'Clean geometric sans, wide round counters, modern digital interfaces',
    sampleText: 'PRECISION GEOMETRY IN VECTOR SPACE'
  },
  {
    id: 'archivo',
    name: 'Archivo',
    cssFamily: "'Archivo', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Omnibus-Type, 19th-century American grotesque revival',
    designer: 'Héctor Gatti',
    bestUse: 'Bold architectural titling, editorial posters, compact headline punch',
    sampleText: 'ARCHITECTURAL DISCIPLINE & MODULAR WEIGHT'
  },
  {
    id: 'epilogue',
    name: 'Epilogue',
    cssFamily: "'Epilogue', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Etcetera Type Co (Tyler Finck), contemporary variable sans',
    designer: 'Tyler Finck',
    bestUse: 'Stark modernist titling, high-contrast weight pairing',
    sampleText: 'CONTEMPORARY VARIABLE EXPERIMENTATION'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    cssFamily: "'DM Sans', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Colophon Foundry, geometric grotesque with subtle humanist charm',
    designer: 'Colophon Foundry',
    bestUse: 'Neutral Swiss body copy, editorial paragraphs, clean pairings',
    sampleText: 'Clear and harmonious typographic composition'
  },
  {
    id: 'urbanist',
    name: 'Urbanist',
    cssFamily: "'Urbanist', sans-serif",
    category: 'grotesk',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Corey Hu, modern geometric grotesque inspired by modern architecture',
    designer: 'Corey Hu',
    bestUse: 'Urban signage, geometric branding, stark minimalist posters',
    sampleText: 'URBAN MINIMALISM & SHARP GEOMETRY'
  },

  // --- INDUSTRIAL & COMPRESSED DISPLAY ---
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
    id: 'oswald',
    name: 'Oswald',
    cssFamily: "'Oswald', sans-serif",
    category: 'display',
    weights: [300, 400, 500, 600, 700],
    origin: 'Vernon Adams, reworking of classic Alternate Gothic',
    designer: 'Vernon Adams',
    bestUse: 'Magazine covers, powerful compact headlines, condensed impact',
    sampleText: 'CLASSIC CONDENSED EDITORIAL POWER'
  },
  {
    id: 'anton',
    name: 'Anton',
    cssFamily: "'Anton', sans-serif",
    category: 'display',
    weights: [400],
    origin: 'Vernon Adams, reworking of a traditional advertising grotesque',
    designer: 'Vernon Adams',
    bestUse: 'Heavyweight graphic posters, high-energy banners, bold punchlines',
    sampleText: 'BOLD PUNCHLINE INDUSTRIAL POSTER'
  },
  {
    id: 'teko',
    name: 'Teko',
    cssFamily: "'Teko', sans-serif",
    category: 'display',
    weights: [400, 500, 600, 700],
    origin: 'Indian Type Foundry, ultra-tall condensed display typeface',
    designer: 'Manushi Parikh',
    bestUse: 'Vertical architecture, ticker ribbons, skyscraper titling',
    sampleText: 'TALL VERTICAL SKYSCRAPER PROPORTIONS'
  },
  {
    id: 'big-shoulders',
    name: 'Big Shoulders Display',
    cssFamily: "'Big Shoulders Display', sans-serif",
    category: 'display',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Patric King, inspired by Chicago protest typography and railway signage',
    designer: 'Patric King',
    bestUse: 'Modern street culture, assertive compressed titles, brutalist layout',
    sampleText: 'CHICAGO RAILWAY & PROTEST LETTERING'
  },

  // --- MONOSPACED & TECHNICAL CODE ---
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    cssFamily: "'JetBrains Mono', monospace",
    category: 'monospace',
    weights: [200, 300, 400, 500, 600, 700, 800],
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
    id: 'fira-code',
    name: 'Fira Code',
    cssFamily: "'Fira Code', monospace",
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    origin: 'Nikita Prokopov, monospaced typeface with programming ligatures',
    designer: 'Nikita Prokopov',
    bestUse: 'Technical code displays, data arrays, clean mathematical alignment',
    sampleText: 'const ratio = 1.618; // => GOLDEN_RATIO'
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    cssFamily: "'IBM Plex Mono', monospace",
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    origin: 'Mike Abbink & Bold Monday for IBM brand transformation',
    designer: 'Mike Abbink',
    bestUse: 'Corporate telemetry, brutalist corporate manuals, mainframe reports',
    sampleText: 'IBM SYSTEM/360 TELEMETRY MATRIX'
  },
  {
    id: 'roboto-mono',
    name: 'Roboto Mono',
    cssFamily: "'Roboto Mono', monospace",
    category: 'monospace',
    weights: [300, 400, 500, 600, 700],
    origin: 'Christian Robertson, monospaced member of the Roboto superfamily',
    designer: 'Christian Robertson',
    bestUse: 'Clean laboratory data tables, engineering readouts, monospace body',
    sampleText: 'SENSOR_ARRAY_DELTA = +0.00342 rad/sec'
  },
  {
    id: 'share-tech-mono',
    name: 'Share Tech Mono',
    cssFamily: "'Share Tech Mono', monospace",
    category: 'monospace',
    weights: [400],
    origin: 'Carrois Type Design, technical monospaced matrix font',
    designer: 'Ralph du Carrois',
    bestUse: 'Terminal interfaces, military HUDs, sci-fi cyber consoles',
    sampleText: 'VECTOR RADAR HUD: TARGET ACQUIRED [OK]'
  },

  // --- HIGH-CONTRAST EDITORIAL SERIFS ---
  {
    id: 'playfair',
    name: 'Playfair Display',
    cssFamily: "'Playfair Display', serif",
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Claus Eggers Sørensen, transitional Enlightenment typography (Didot / Bodoni)',
    designer: 'Claus Eggers Sørensen',
    bestUse: 'Acid editorial, high stroke contrast, dramatic fashion and art monograph titles',
    sampleText: 'The Sublime Geometry of Optical Contrast'
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    cssFamily: "'Cinzel', serif",
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Natanael Gama, inspired by classical Roman inscriptional capitals',
    designer: 'Natanael Gama',
    bestUse: 'High-contrast modern monumentalism, luxury editorial, classical tension',
    sampleText: 'MONUMENTAL ARCHITECTURE OF THE LETTER'
  },
  {
    id: 'dm-serif',
    name: 'DM Serif Display',
    cssFamily: "'DM Serif Display', serif",
    category: 'serif',
    weights: [400],
    origin: 'Colophon Foundry, high-contrast transitional display serif',
    designer: 'Colophon Foundry',
    bestUse: 'Editorial magazine headlines, literary journals, cultural posters',
    sampleText: 'Sophisticated Literary Cadence and Tension'
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    cssFamily: "'Cormorant Garamond', serif",
    category: 'serif',
    weights: [400, 500, 600, 700],
    origin: 'Christian Thalmann, Renaissance Garamond revival with razor-sharp serifs',
    designer: 'Christian Thalmann',
    bestUse: 'Classical book arts, delicate poetic titles, extreme elegance',
    sampleText: 'Renaissance Proportions & Razor Hairlines'
  },
  {
    id: 'bodoni-moda',
    name: 'Bodoni Moda',
    cssFamily: "'Bodoni Moda', serif",
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    origin: 'Giambattista Bodoni (Parma 1788), digitized by Owen Earl',
    designer: 'Owen Earl',
    bestUse: 'Haute couture, radical Didone stroke contrast (1:16 ratio), fashion monograph',
    sampleText: 'RADICAL DIDONE STROKE CONTRAST'
  },
  {
    id: 'fraunces',
    name: 'Fraunces',
    cssFamily: "'Fraunces', serif",
    category: 'serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
    origin: 'Undercase Type (Phaedra Charles, Flavia Zimbardi), quirky retro serif',
    designer: 'Undercase Type',
    bestUse: 'Warm tactile editorial, organic curves, contemporary display headlines',
    sampleText: 'Warm, tactile and expressive organic serif'
  },

  // --- EXPERIMENTAL & DISPLAY ---
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
    id: 'monoton',
    name: 'Monoton',
    cssFamily: "'Monoton', sans-serif",
    category: 'experimental',
    weights: [400],
    origin: 'Vernon Adams, multi-line disco & retro-futuristic display',
    designer: 'Vernon Adams',
    bestUse: 'Kinetic wireframe typography, neon lines, op-art visual effects',
    sampleText: 'MULTILINE KINETIC OP-ART'
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
  },
  {
    id: 'silkscreen',
    name: 'Silkscreen',
    cssFamily: "'Silkscreen', monospace",
    category: 'experimental',
    weights: [400, 700],
    origin: 'Jason Kottke (2001), quintessential 8-bit bitmap font',
    designer: 'Jason Kottke',
    bestUse: 'Retro-gaming telemetry, lo-fi digital art, pixel-perfect brutalist accents',
    sampleText: 'PIXEL PERFECT BITMAP 8-BIT DISPLAY'
  },
  {
    id: 'rubik-glitch',
    name: 'Rubik Glitch',
    cssFamily: "'Rubik Glitch', display",
    category: 'experimental',
    weights: [400],
    origin: 'Philipp Nurullin, high-intensity digital distortion font',
    designer: 'Philipp Nurullin',
    bestUse: 'Corrupted data streams, cybernetic errors, brutalist noise graphics',
    sampleText: 'CORRUPTED VECTOR DATA STREAM'
  }
];
