import type { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Tracking vs. Kerning',
    category: 'Metrics',
    definition: 'Tracking (letter-spacing) applies uniform spacing across an entire run of characters. Kerning refers to optical adjustment between specific character pairs (such as AV, Ty, We) to remove irregular white gaps.',
    etymologyOrContext: 'Derived from metal typesetting kerning slugs where character bodies were physically shaved to tuck under adjacent letters.',
    formulaOrRule: 'Rule of thumb: High point sizes need tighter tracking; small micro-sizes (<10px) require expanded positive tracking.'
  },
  {
    term: 'Leading (Line Height)',
    category: 'Metrics',
    definition: 'The vertical distance between the baselines of successive lines of type. Named after the physical strips of lead inserted between lines of handset metal type in Gutenberg printshops.',
    etymologyOrContext: 'Traditional formula: e.g., 10/12 means 10pt type set on 12pt leading (120% line-height).',
    formulaOrRule: 'Longer line lengths (measures > 60 chars) require proportionally looser leading for the eye to locate the next line start.'
  },
  {
    term: 'Optical Size',
    category: 'Digital Typography',
    definition: 'The practice of tailoring glyph proportions to specific viewing scales. Display cuts possess higher stroke contrast and razor hair-lines; caption cuts feature heavy stems, enlarged x-heights, and wide counters.',
    etymologyOrContext: 'Originated with punchcutters who cut distinct steel punches for every single point size.',
    formulaOrRule: 'Modern OpenType Variable fonts utilize the `opsz` axis to morph seamlessly between text and display geometries.'
  },
  {
    term: 'Tabular vs. Proportional Figures',
    category: 'Typesetting',
    definition: 'Proportional numbers vary in width (e.g., "1" is narrower than "8"). Tabular numbers all share identical monospaced advance widths so that columns of financial figures align perfectly vertical.',
    etymologyOrContext: 'Essential for data tables, countdown timers, financial ledgers, and telemetry coordinates.',
    formulaOrRule: 'CSS: `font-variant-numeric: tabular-nums;` or `font-feature-settings: "tnum" 1;`'
  },
  {
    term: 'Ligatures & Stylistic Alternates',
    category: 'Anatomy',
    definition: 'A ligature fuses two or more adjacent letters into a single unified glyph to prevent collision between ascenders and dots (e.g., fi, fl, ffi). Stylistic alternates provide variant letter shapes (single-story "a" vs double-story "a").',
    etymologyOrContext: 'Scribes in medieval scriptoria joined characters to speed handwriting and save parchment space.',
    formulaOrRule: 'Common OpenType tags: `liga` (standard ligatures), `dlig` (discretionary), `ss01` - `ss20` (stylistic sets).'
  },
  {
    term: 'Modular Grid (Raster Systeme)',
    category: 'Typesetting',
    definition: 'A structural framework of intersecting horizontal and vertical guide lines used to structure content into coherent spatial fields, columns, and margins.',
    etymologyOrContext: 'Codified in Zürich and Basel in the 1950s by Josef Müller-Brockmann, Max Bill, and Karl Gerstner.',
    formulaOrRule: 'A strict mathematical grid allows asymmetric freedom without losing architectural balance.'
  },
  {
    term: 'Ink Traps',
    category: 'Anatomy',
    definition: 'Deliberate cutouts or notches carved into the acute inner corners of glyphs (such as inside the vertex of M, N, W). At small print sizes, ink naturally pools into tight corners; the cutout counteracts the pooling so the letter renders crisp.',
    etymologyOrContext: 'Pioneered by Matthew Carter (Bell Centennial for telephone books) and Matthew Butterick.',
    formulaOrRule: 'In modern brutalist web design, ink traps are magnified into intentional expressive architectural features.'
  },
  {
    term: 'Measure (Line Length)',
    category: 'Metrics',
    definition: 'The horizontal length of a line of text, traditionally measured in picas or characters. The optimal comfortable reading length for continuous text is between 45 and 75 characters per line.',
    etymologyOrContext: 'Lines that are too long cause reader fatigue; lines that are too short break semantic rhythm.',
    formulaOrRule: 'CSS best practice: `max-w-[65ch]` for editorial body text.'
  }
];
