export interface StudioPlate {
  id: string;
  label: string;
  category: 'Photographic' | 'Swiss Construct' | 'Technical / Radar' | 'Op-Art & Kinetic';
  caption: string;
  url: string;
}

const svgPlate = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const STUDIO_PLATES: StudioPlate[] = [
  // 1. PHOTOGRAPHIC PLATES (14 High-Resolution Studio & Architectural Plates)
  {
    id: 'swiss-brutalist',
    label: 'SWISS BRUTALIST',
    category: 'Photographic',
    caption: 'Fig. 01 // Architectural Monolith Shadow Study',
    url: '/images/swiss-grid-abstract-geometry.jpg',
  },
  {
    id: 'brutalist-vault',
    label: 'BRUTALIST VAULT',
    category: 'Photographic',
    caption: 'Fig. 02 // Cantilevered Concrete Alpine Shaft',
    url: '/images/brutalist-concrete-vault.jpg',
  },
  {
    id: 'brutalist-facade',
    label: 'CONSTRUCTIVIST FACADE',
    category: 'Photographic',
    caption: 'Fig. 03 // Double-Exposure Concrete Monolith Grid',
    url: '/images/swiss-brutalist-facade.jpg',
  },
  {
    id: 'ferrofluid-bloom',
    label: 'FERROFLUID INK BLOOM',
    category: 'Photographic',
    caption: 'Fig. 04 // Dendritic Sumi & Ferrofluid Capillary Study',
    url: '/images/ferrofluid-ink-bloom.jpg',
  },
  {
    id: 'macro-ink-bleed',
    label: 'MACRO INK BLEED',
    category: 'Photographic',
    caption: 'Fig. 05 // Lithographic Capillary Dispersion',
    url: '/images/macro-ink-interference-plate.jpg',
  },
  {
    id: 'oxidized-etching',
    label: 'INK & LINEN FIBERS',
    category: 'Photographic',
    caption: 'Fig. 06 // Macro Iridescent Ink in Raw Hemp Fibers',
    url: '/images/oxidized-etching-plate.jpg',
  },
  {
    id: 'suminagashi-ink',
    label: 'SUMINAGASHI MARBLE',
    category: 'Photographic',
    caption: 'Fig. 07 // Floating Sumi Ink Fluid Interference Rings',
    url: '/images/suminagashi-marble-ink.jpg',
  },
  {
    id: 'crumpled-kraft',
    label: 'CRUMPLED KRAFT',
    category: 'Photographic',
    caption: 'Fig. 08 // Folded Archival Kraft Relief',
    url: '/images/crumpled-paper-plate.jpg',
  },
  {
    id: 'wheatpaste-fold',
    label: 'FOLDED WHEATPASTE',
    category: 'Photographic',
    caption: 'Fig. 09 // Weathered Street Poster Crease & Deckle Edge',
    url: '/images/folded-wheatpaste-poster.jpg',
  },
  {
    id: 'kraft-collage',
    label: 'TORN KRAFT COLLAGE',
    category: 'Photographic',
    caption: 'Fig. 10 // Sculptural Charcoal & Unbleached Kraft Relief',
    url: '/images/torn-kraft-collage.jpg',
  },
  {
    id: 'darkroom-optics',
    label: 'DARKROOM OPTICS',
    category: 'Photographic',
    caption: 'Fig. 11 // Silver Halide Focal Caustics',
    url: '/images/type-lab-darkroom-texture.jpg',
  },
  {
    id: 'celluloid-burn',
    label: 'CELLULOID FILM BURN',
    category: 'Photographic',
    caption: 'Fig. 12 // 35mm Emulsion Developer Burn & Safelight',
    url: '/images/celluloid-film-burn.jpg',
  },
  {
    id: 'risograph-mesh',
    label: 'RISOGRAPH MESH',
    category: 'Photographic',
    caption: 'Fig. 13 // Dual-Drum Soy Halftone Screen',
    url: '/images/risograph-halftone-mesh.jpg',
  },
  {
    id: 'photostat-grain',
    label: 'PHOTOSTAT GRAIN',
    category: 'Photographic',
    caption: 'Fig. 14 // Electrostatic Toner Transfer',
    url: '/images/photostat-grain-plate.jpg',
  },

  // 2. SWISS CONSTRUCT PLATES (High-precision vector artwork)
  {
    id: 'tonhalle-arcs',
    label: 'TONHALLE ARCS 1955',
    category: 'Swiss Construct',
    caption: 'Fig. 07 // Acoustic Concentric Rhythm (Zürich 1955)',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#0B0D11"/>
      <g fill="none" stroke="#F4F5F7">
        <path d="M 80,360 A 320,320 0 0,1 720,360" stroke-width="28" opacity="0.9"/>
        <path d="M 140,360 A 260,260 0 0,1 660,360" stroke-width="18" opacity="0.7"/>
        <path d="M 200,360 A 200,200 0 0,1 600,360" stroke-width="12" opacity="0.5"/>
        <path d="M 260,360 A 140,140 0 0,1 540,360" stroke-width="6" opacity="0.35"/>
        <path d="M 320,360 A 80,80 0 0,1 480,360" stroke-width="3" opacity="0.25"/>
      </g>
      <line x1="0" y1="60" x2="800" y2="60" stroke="#F4F5F7" stroke-width="1" opacity="0.2"/>
      <line x1="400" y1="0" x2="400" y2="360" stroke="#E62E25" stroke-width="2" opacity="0.85"/>
      <circle cx="400" cy="180" r="10" fill="#E62E25"/>
    </svg>`),
  },
  {
    id: 'bauhaus-kunstbau',
    label: 'DESSAU GEOMETRY',
    category: 'Swiss Construct',
    caption: 'Fig. 08 // Constructivist Planar Equilibrium',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#12141A"/>
      <rect x="60" y="40" width="220" height="280" fill="#D92B2B" opacity="0.9"/>
      <circle cx="420" cy="180" r="125" fill="#F4EFE6" opacity="0.92"/>
      <circle cx="420" cy="180" r="65" fill="#12141A"/>
      <polygon points="560,310 680,50 750,310" fill="#FACC15" opacity="0.9"/>
      <line x1="40" y1="180" x2="760" y2="180" stroke="#F4F5F7" stroke-width="2" opacity="0.4"/>
      <rect x="240" y="140" width="80" height="80" fill="#0051FF" opacity="0.85"/>
    </svg>`),
  },
  {
    id: 'modular-progression',
    label: 'FIBONACCI PROGRESSION',
    category: 'Swiss Construct',
    caption: 'Fig. 09 // Mathematical Ratio Progression (1:1.618)',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#090B0E"/>
      <g fill="#F4F5F7">
        <rect x="40" y="30" width="8" height="300" opacity="0.25"/>
        <rect x="64" y="30" width="13" height="300" opacity="0.35"/>
        <rect x="96" y="30" width="21" height="300" opacity="0.45"/>
        <rect x="138" y="30" width="34" height="300" opacity="0.55"/>
        <rect x="196" y="30" width="55" height="300" opacity="0.7"/>
        <rect x="278" y="30" width="89" height="300" opacity="0.85"/>
        <rect x="396" y="30" width="144" height="300" opacity="0.95"/>
        <rect x="570" y="30" width="190" height="300" fill="#FF4F00"/>
      </g>
    </svg>`),
  },
  {
    id: 'isometric-monolith',
    label: 'AXONOMETRIC MONOLITH',
    category: 'Swiss Construct',
    caption: 'Fig. 10 // Axonometric Brutalist Structure',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#0D0F14"/>
      <g stroke="#262D3B" stroke-width="1">
        <line x1="0" y1="90" x2="800" y2="90"/><line x1="0" y1="180" x2="800" y2="180"/><line x1="0" y1="270" x2="800" y2="270"/>
        <line x1="200" y1="0" x2="200" y2="360"/><line x1="400" y1="0" x2="400" y2="360"/><line x1="600" y1="0" x2="600" y2="360"/>
      </g>
      <polygon points="400,35 560,115 400,195 240,115" fill="#F4F5F7"/>
      <polygon points="240,115 400,195 400,330 240,250" fill="#9AA2B1"/>
      <polygon points="400,195 560,115 560,250 400,330" fill="#3A4354"/>
      <polygon points="150,140 240,185 150,230 60,185" fill="#E62E25" opacity="0.9"/>
      <polygon points="650,140 740,185 650,230 560,185" fill="#00E5FF" opacity="0.85"/>
    </svg>`),
  },

  // 3. TECHNICAL / RADAR PLATES
  {
    id: 'pulsar-elevation',
    label: 'PULSAR WAVEFORM 1919',
    category: 'Technical / Radar',
    caption: 'Fig. 11 // Radio Astronomy Stacked Elevation Profile',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#07080A"/>
      <g fill="#07080A" stroke="#F4F5F7" stroke-width="1.8">
        <path d="M 40,60 L 240,60 Q 320,60 360,22 Q 400,-10 440,28 Q 480,60 560,60 L 760,60"/>
        <path d="M 40,95 L 220,95 Q 310,95 350,40 Q 385,0 415,52 Q 450,20 485,68 Q 520,95 580,95 L 760,95"/>
        <path d="M 40,130 L 250,130 Q 330,130 375,65 Q 405,15 435,75 Q 470,130 560,130 L 760,130"/>
        <path d="M 40,165 L 210,165 Q 290,165 340,110 Q 380,45 410,95 Q 445,35 485,115 Q 530,165 600,165 L 760,165"/>
        <path d="M 40,200 L 230,200 Q 320,200 365,125 Q 400,55 435,135 Q 475,200 570,200 L 760,200"/>
        <path d="M 40,235 L 240,235 Q 310,235 355,175 Q 395,95 425,160 Q 460,115 495,185 Q 540,235 610,235 L 760,235"/>
        <path d="M 40,270 L 260,270 Q 340,270 380,205 Q 410,150 445,215 Q 485,270 570,270 L 760,270"/>
        <path d="M 40,305 L 280,305 Q 350,305 390,260 Q 420,225 450,270 Q 490,305 580,305 L 760,305"/>
      </g>
    </svg>`),
  },
  {
    id: 'spectrograph-matrix',
    label: 'ACOUSTIC SPECTROGRAM',
    category: 'Technical / Radar',
    caption: 'Fig. 12 // Harmonic Frequency Distribution Matrix',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#080A0F"/>
      <g fill="#00E5FF" opacity="0.85">
        <rect x="40" y="160" width="12" height="40"/><rect x="64" y="130" width="12" height="100"/><rect x="88" y="90" width="12" height="180"/>
        <rect x="112" y="50" width="12" height="260"/><rect x="136" y="80" width="12" height="200"/><rect x="160" y="120" width="12" height="120"/>
        <rect x="184" y="150" width="12" height="60"/><rect x="208" y="110" width="12" height="140"/><rect x="232" y="60" width="12" height="240"/>
        <rect x="256" y="30" width="12" height="300" fill="#F4F5F7"/><rect x="280" y="70" width="12" height="220"/><rect x="304" y="100" width="12" height="160"/>
        <rect x="328" y="140" width="12" height="80"/><rect x="352" y="95" width="12" height="170"/><rect x="376" y="45" width="12" height="270"/>
        <rect x="400" y="25" width="12" height="310" fill="#FF2A6D"/><rect x="424" y="65" width="12" height="230"/><rect x="448" y="115" width="12" height="130"/>
        <rect x="472" y="145" width="12" height="70"/><rect x="496" y="105" width="12" height="150"/><rect x="520" y="55" width="12" height="250"/>
        <rect x="544" y="85" width="12" height="190"/><rect x="568" y="125" width="12" height="110"/><rect x="592" y="75" width="12" height="210"/>
        <rect x="616" y="40" width="12" height="280" fill="#F4F5F7"/><rect x="640" y="90" width="12" height="180"/><rect x="664" y="135" width="12" height="90"/>
        <rect x="688" y="155" width="12" height="50"/><rect x="712" y="120" width="12" height="120"/><rect x="736" y="160" width="12" height="40"/>
      </g>
      <line x1="0" y1="180" x2="800" y2="180" stroke="#080A0F" stroke-width="4"/>
    </svg>`),
  },
  {
    id: 'celestial-cartography',
    label: 'CELESTIAL ASTROLABE',
    category: 'Technical / Radar',
    caption: 'Fig. 13 // Orbital Ephemeris & Declination Chart',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#0B1320"/>
      <g fill="none" stroke="#F4F5F7" opacity="0.55">
        <circle cx="400" cy="180" r="150" stroke-width="1.5"/>
        <circle cx="400" cy="180" r="110" stroke-width="1" stroke-dasharray="6 4"/>
        <circle cx="400" cy="180" r="70" stroke-width="1"/>
        <ellipse cx="400" cy="180" rx="280" ry="90" stroke-width="1.2"/>
        <ellipse cx="400" cy="180" rx="280" ry="90" transform="rotate(25 400 180)" stroke-width="1" opacity="0.6"/>
        <line x1="60" y1="180" x2="740" y2="180" stroke-width="0.8"/>
      </g>
      <circle cx="400" cy="180" r="14" fill="#FFB800"/>
      <circle cx="290" cy="180" r="6" fill="#F4F5F7"/>
      <circle cx="550" cy="180" r="8" fill="#00E5FF"/>
    </svg>`),
  },
  {
    id: 'microfilm-aperture',
    label: 'APERTURE PUNCH CARD',
    category: 'Technical / Radar',
    caption: 'Fig. 14 // Hollerith 80-Column Binary Aperture Card',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#14171F"/>
      <rect x="30" y="25" width="740" height="310" fill="none" stroke="#F4F5F7" stroke-width="1.5" opacity="0.4"/>
      <rect x="440" y="55" width="290" height="250" fill="#07080A" stroke="#F4F5F7" stroke-width="1.5" opacity="0.8"/>
      <circle cx="585" cy="180" r="85" fill="none" stroke="#F4F5F7" stroke-width="2" opacity="0.7"/>
      <circle cx="585" cy="180" r="40" fill="#F4F5F7" opacity="0.85"/>
      <g fill="#F4F5F7" opacity="0.75">
        <rect x="60" y="60" width="18" height="8"/><rect x="110" y="60" width="18" height="8"/><rect x="190" y="60" width="18" height="8"/><rect x="270" y="60" width="18" height="8"/><rect x="350" y="60" width="18" height="8"/>
        <rect x="85" y="95" width="18" height="8"/><rect x="165" y="95" width="18" height="8"/><rect x="220" y="95" width="18" height="8"/><rect x="320" y="95" width="18" height="8"/>
        <rect x="60" y="130" width="18" height="8"/><rect x="135" y="130" width="18" height="8"/><rect x="245" y="130" width="18" height="8"/><rect x="350" y="130" width="18" height="8"/>
        <rect x="110" y="165" width="18" height="8"/><rect x="190" y="165" width="18" height="8"/><rect x="295" y="165" width="18" height="8"/>
        <rect x="60" y="200" width="18" height="8"/><rect x="165" y="200" width="18" height="8"/><rect x="245" y="200" width="18" height="8"/><rect x="320" y="200" width="18" height="8"/>
        <rect x="85" y="235" width="18" height="8"/><rect x="135" y="235" width="18" height="8"/><rect x="270" y="235" width="18" height="8"/><rect x="350" y="235" width="18" height="8"/>
        <rect x="110" y="270" width="18" height="8"/><rect x="220" y="270" width="18" height="8"/><rect x="295" y="270" width="18" height="8"/>
      </g>
    </svg>`),
  },

  // 4. OP-ART & KINETIC PLATES
  {
    id: 'vasarely-kinetic-sphere',
    label: 'OP-ART KINETIC SPHERE',
    category: 'Op-Art & Kinetic',
    caption: 'Fig. 15 // Optical Phase Warp (Vasarely Homage)',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#08090C"/>
      <g fill="none" stroke="#F4F5F7" stroke-width="2" opacity="0.85">
        <ellipse cx="400" cy="180" rx="340" ry="150"/>
        <ellipse cx="400" cy="180" rx="300" ry="135" transform="rotate(4 400 180)"/>
        <ellipse cx="400" cy="180" rx="260" ry="120" transform="rotate(8 400 180)"/>
        <ellipse cx="400" cy="180" rx="220" ry="105" transform="rotate(12 400 180)"/>
        <ellipse cx="400" cy="180" rx="180" ry="90" transform="rotate(16 400 180)"/>
        <ellipse cx="400" cy="180" rx="140" ry="75" transform="rotate(20 400 180)"/>
        <ellipse cx="400" cy="180" rx="100" ry="58" transform="rotate(24 400 180)"/>
        <ellipse cx="400" cy="180" rx="60" ry="38" transform="rotate(28 400 180)"/>
        <ellipse cx="400" cy="180" rx="25" ry="18" transform="rotate(32 400 180)"/>
      </g>
    </svg>`),
  },
  {
    id: 'halftone-gradient-matrix',
    label: 'HALFTONE MATRIX FIELD',
    category: 'Op-Art & Kinetic',
    caption: 'Fig. 16 // Optical Density Modulation Screen',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#0B0D12"/>
      <g fill="#F4F5F7">
        ${Array.from({ length: 16 }).map((_, col) =>
          Array.from({ length: 7 }).map((__, row) => {
            const cx = 50 + col * 46;
            const cy = 42 + row * 46;
            const dist = Math.hypot(cx - 400, cy - 180);
            const r = Math.max(2, 19 - dist / 22);
            return `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" opacity="${Math.min(0.95, (r / 18)).toFixed(2)}"/>`;
          }).join('')
        ).join('')}
      </g>
    </svg>`),
  },
  {
    id: 'kinetic-checker-warp',
    label: 'PERSPECTIVE CHECKER WARP',
    category: 'Op-Art & Kinetic',
    caption: 'Fig. 17 // Bridget Riley Optical Checkerboard Compression',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#0A0B0E"/>
      <g fill="#F4F5F7">
        ${[0, 60, 115, 162, 200, 230, 252, 268, 282, 298, 320, 350, 388, 435, 490, 550, 620, 700, 800].slice(0, 18).map((x, i, arr) => {
          const w = (arr[i + 1] || 800) - x;
          return Array.from({ length: 6 }).map((_, row) => {
            if ((i + row) % 2 !== 0) return '';
            return `<rect x="${x}" y="${row * 60}" width="${w}" height="60" opacity="0.9"/>`;
          }).join('');
        }).join('')}
      </g>
    </svg>`),
  },
  {
    id: 'risograph-venn-overprint',
    label: 'RISO OVERPRINT VENN',
    category: 'Op-Art & Kinetic',
    caption: 'Fig. 18 // Chromatic Subtractive Overprint Registration',
    url: svgPlate(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="800" height="360">
      <rect width="800" height="360" fill="#F4EFE6"/>
      <circle cx="290" cy="180" r="135" fill="#FF2A6D" opacity="0.75"/>
      <circle cx="430" cy="180" r="135" fill="#0051FF" opacity="0.72"/>
      <circle cx="530" cy="180" r="95" fill="#FFB800" opacity="0.8"/>
      <line x1="60" y1="180" x2="740" y2="180" stroke="#121316" stroke-width="1.5" stroke-dasharray="6 4"/>
    </svg>`),
  },
];

