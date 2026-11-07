import React, { useState } from 'react';
import { CURATED_SPECIMENS } from '../../data/specimens';
import type { SpecimenItem } from '../../data/specimens';
import type { TypographicState } from '../../types';
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  Grid,
  Info,
  Sparkles
} from 'lucide-react';

interface SpecimensPageProps {
  onLoadIntoPlayground: (presetState: Partial<TypographicState>) => void;
}

export const SpecimensPage: React.FC<SpecimensPageProps> = ({ onLoadIntoPlayground }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [globalTestText, setGlobalTestText] = useState<string>('');
  const [expandedSpecimenId, setExpandedSpecimenId] = useState<string | null>(null);
  const [inspectedGlyph, setInspectedGlyph] = useState<string | null>(null);

  const categories = ['All', 'Grotesk', 'Monospace', 'Pairing', 'Kinetic', 'Experimental'];

  const filteredSpecimens = selectedCategory === 'All'
    ? CURATED_SPECIMENS
    : CURATED_SPECIMENS.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenInPlayground = (specimen: SpecimenItem) => {
    // Map specimen parameters to TypographicState
    const fontCssMap: Record<string, string> = {
      'plus-jakarta': "'Plus Jakarta Sans', sans-serif",
      'jetbrains-mono': "'JetBrains Mono', monospace",
      'playfair': "'Playfair Display', serif",
      'syne': "'Syne', sans-serif",
      'major-mono': "'Major Mono Display', monospace",
      'cinzel': "'Cinzel', serif",
      'space-grotesk': "'Space Grotesk', sans-serif",
      'space-mono': "'Space Mono', monospace",
    };

    onLoadIntoPlayground({
      text: globalTestText.trim() ? globalTestText : specimen.headline,
      subText: specimen.subhead,
      showSubText: true,
      subFontFamily: fontCssMap[specimen.secondaryFontId] || "'JetBrains Mono', monospace",
      subFontSize: 13,
      subFontWeight: 400,
      subLetterSpacing: 0.04,
      subTextColor: specimen.palette.accent,
      fontFamily: fontCssMap[specimen.primaryFontId] || "'Space Grotesk', sans-serif",
      fontSize: Math.min(52, specimen.metadata.pointSize),
      fontWeight: specimen.metadata.weight,
      lineHeight: specimen.metadata.leading,
      letterSpacing: specimen.metadata.tracking,
      textColor: specimen.palette.text,
      backgroundColor: specimen.palette.bg,
      textAlign: specimen.metadata.alignment,
      canvasFrame: specimen.category === 'Kinetic' ? 'ribbon' : 'poster',
      showGrid: false,
      gridType: 'modular'
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#070809] text-[#F4F5F7] font-mono-code pb-24">
      
      {/* Header Banner & Telemetry */}
      <section className="relative border-b border-[#22262E] bg-[#0A0C10] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 swiss-grid-pattern opacity-30 pointer-events-none" />
        
        {/* Background photo accent */}
        <div 
          className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-cover bg-center pointer-events-none hidden lg:block"
          style={{ backgroundImage: `url('/images/swiss-grid-abstract-geometry.jpg')` }}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#00FF66]">
            <span className="w-2 h-2 bg-[#00FF66] inline-block animate-pulse"></span>
            <span>SPECIMEN ARCHIVE // CURATED PHYSICAL & DIGITAL TYPESETS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-space font-black tracking-tighter uppercase text-[#F4F5F7]">
            TYPOGRAPHIC SPECIMENS
          </h1>

          <p className="max-w-[65ch] text-sm sm:text-base text-[#C2CAD8] font-mono-code leading-relaxed">
            Curated experiments in Swiss modularity, extreme tracking, optical tension, and monospaced telemetry. 
            Test your own custom copy globally or inspect individual character glyphs and type scale ladders.
          </p>

          {/* Interactive Global Live-Test String Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={globalTestText}
                onChange={(e) => setGlobalTestText(e.target.value)}
                placeholder="TYPE HERE TO PREVIEW YOUR TEXT IN ALL SPECIMENS SIMULTaneously..."
                className="w-full bg-[#11141A] border border-[#272F3E] focus:border-[#00FF66] text-[#00FF66] px-4 py-2.5 text-xs font-mono-code rounded-none focus:outline-none placeholder-[#4E5868]"
              />
              {globalTestText && (
                <button
                  onClick={() => setGlobalTestText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#758091] hover:text-[#F4F5F7]"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 text-[11px] font-mono-code uppercase transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? 'bg-[#16221C] border-[#00FF66] text-[#00FF66] font-bold'
                      : 'bg-[#11141A] border-[#1F2532] text-[#758091] hover:text-[#F4F5F7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Specimens Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 gap-12">
          {filteredSpecimens.map((specimen) => {
            const isExpanded = expandedSpecimenId === specimen.id;
            const displayText = globalTestText.trim() ? globalTestText : specimen.headline;

            // Generate scale ladder
            const scaleRhythm = [12, 16, 24, 36, 48, 72];

            return (
              <article 
                key={specimen.id}
                className="border border-[#22262E] bg-[#0A0C10] shadow-xl overflow-hidden transition-all hover:border-[#384254] flex flex-col"
              >
                {/* Specimen Header Metadata Bar */}
                <div className="px-5 py-3 bg-[#0E1117] border-b border-[#1E232E] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#00FF66] px-2 py-0.5 bg-[#142319] border border-[#00FF66]/30 text-[10px]">
                      {specimen.catalogId}
                    </span>
                    <span className="font-space font-bold text-[#F4F5F7] tracking-tight text-sm">
                      {specimen.title}
                    </span>
                    <span className="text-[#3A4354]">/</span>
                    <span className="text-[#758091] text-[11px] hidden sm:inline">
                      {specimen.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenInPlayground(specimen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66] hover:bg-[#4DFF95] text-[#070809] font-bold text-[11px] transition-colors"
                      title="Load this specimen configuration into Playground"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>EDIT IN PLAYGROUND</span>
                    </button>

                    <button
                      onClick={() => setExpandedSpecimenId(isExpanded ? null : specimen.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#161B24] hover:bg-[#202735] text-[#9AA2B1] hover:text-[#F4F5F7] border border-[#272F3E] text-[11px] transition-colors"
                    >
                      <span>{isExpanded ? 'COLLAPSE' : 'INSPECT GLYPHS'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* The Core Live Specimen Artboard */}
                <div 
                  className="p-8 sm:p-12 transition-colors relative overflow-hidden"
                  style={{
                    backgroundColor: specimen.palette.bg,
                    color: specimen.palette.text,
                    borderBottom: '1px solid #1E232E'
                  }}
                >
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 swiss-grid-pattern opacity-15 pointer-events-none" />

                  <div className="relative z-10 max-w-5xl space-y-6">
                    {/* Primary Headline Specimen */}
                    <div 
                      className="font-bold tracking-tight transition-all break-words"
                      style={{
                        fontFamily: specimen.primaryFontName === 'Plus Jakarta Sans' ? "'Plus Jakarta Sans', sans-serif" :
                                    specimen.primaryFontName === 'JetBrains Mono' ? "'JetBrains Mono', monospace" :
                                    specimen.primaryFontName === 'Playfair Display' ? "'Playfair Display', serif" :
                                    specimen.primaryFontName === 'Syne' ? "'Syne', sans-serif" :
                                    specimen.primaryFontName === 'Major Mono Display' ? "'Major Mono Display', monospace" :
                                    specimen.primaryFontName === 'Cinzel' ? "'Cinzel', serif" : "'Space Grotesk', sans-serif",
                        fontSize: `clamp(2.5rem, 6vw, ${specimen.metadata.pointSize}px)`,
                        fontWeight: specimen.metadata.weight,
                        lineHeight: specimen.metadata.leading,
                        letterSpacing: `${specimen.metadata.tracking}em`,
                        textAlign: specimen.metadata.alignment,
                        fontStyle: specimen.category === 'Pairing' ? 'italic' : 'normal'
                      }}
                    >
                      {displayText}
                    </div>

                    {/* Subheadline and Pairing */}
                    <div 
                      className="text-lg sm:text-2xl opacity-80"
                      style={{
                        fontFamily: specimen.secondaryFontName === 'JetBrains Mono' ? "'JetBrains Mono', monospace" :
                                    specimen.secondaryFontName === 'Space Mono' ? "'Space Mono', monospace" :
                                    specimen.secondaryFontName === 'Space Grotesk' ? "'Space Grotesk', sans-serif" :
                                    "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: '0.02em',
                        textAlign: specimen.metadata.alignment,
                        color: specimen.palette.accent
                      }}
                    >
                      {specimen.subhead}
                    </div>

                    {/* Editorial Body Snippet */}
                    <p 
                      className="text-sm sm:text-base max-w-[65ch] opacity-90 font-mono-code leading-relaxed pt-2"
                      style={{
                        textAlign: specimen.metadata.alignment,
                      }}
                    >
                      {specimen.bodySnippet}
                    </p>

                    {/* Technical Telemetry Badges */}
                    <div className="pt-6 flex flex-wrap gap-2 text-[10px] font-mono-code border-t border-current/20">
                      <span className="px-2 py-1 bg-white/5 border border-current/20">
                        PRIMARY: {specimen.primaryFontName}
                      </span>
                      <span className="px-2 py-1 bg-white/5 border border-current/20">
                        PAIRING: {specimen.secondaryFontName}
                      </span>
                      <span className="px-2 py-1 bg-white/5 border border-current/20">
                        PT: {specimen.metadata.pointSize}px
                      </span>
                      <span className="px-2 py-1 bg-white/5 border border-current/20">
                        LEADING: {specimen.metadata.leading}
                      </span>
                      <span className="px-2 py-1 bg-white/5 border border-current/20">
                        TRACKING: {specimen.metadata.tracking}em
                      </span>
                      <span className="px-2 py-1 bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                        CONTRAST: {specimen.metadata.contrast}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Inspector Drawer (Glyphs, Scale, OpenType) */}
                {isExpanded && (
                  <div className="bg-[#0D1016] p-6 sm:p-8 space-y-6 border-t border-[#22262E]">
                    
                    {/* Glyphs Character Matrix */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#758091]">
                        <span className="font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                          <Grid className="w-3.5 h-3.5 text-[#00FF66]" />
                          CHARACTER GLYPHS MATRIX (CLICK GLYPH TO INSPECT)
                        </span>
                        <span>{specimen.primaryFontName}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 p-3 bg-[#070809] border border-[#1E232E]">
                        {specimen.glyphSample.split('').filter(c => c !== ' ').map((glyph, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInspectedGlyph(glyph)}
                            className={`w-8 h-8 flex items-center justify-center border text-sm transition-all ${
                              inspectedGlyph === glyph
                                ? 'border-[#00FF66] bg-[#14261B] text-[#00FF66] scale-110 z-10'
                                : 'border-[#1C212B] bg-[#0E1117] text-[#C2CAD8] hover:border-[#00FF66] hover:text-[#00FF66]'
                            }`}
                            style={{
                              fontFamily: specimen.primaryFontName === 'Plus Jakarta Sans' ? "'Plus Jakarta Sans', sans-serif" :
                                          specimen.primaryFontName === 'JetBrains Mono' ? "'JetBrains Mono', monospace" :
                                          specimen.primaryFontName === 'Playfair Display' ? "'Playfair Display', serif" :
                                          specimen.primaryFontName === 'Syne' ? "'Syne', sans-serif" :
                                          specimen.primaryFontName === 'Major Mono Display' ? "'Major Mono Display', monospace" :
                                          specimen.primaryFontName === 'Cinzel' ? "'Cinzel', serif" : "'Space Grotesk', sans-serif"
                            }}
                          >
                            {glyph}
                          </button>
                        ))}
                      </div>

                      {/* Inspected Glyph Detail Bar */}
                      {inspectedGlyph && (
                        <div className="p-3 bg-[#131720] border border-[#273244] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 flex items-center justify-center text-2xl font-bold bg-[#070809] text-[#00FF66] border border-[#00FF66]/40">
                              {inspectedGlyph}
                            </span>
                            <div>
                              <div className="font-bold text-[#F4F5F7]">GLYPH: &quot;{inspectedGlyph}&quot;</div>
                              <div className="text-[10px] text-[#758091]">
                                UNICODE: U+{inspectedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')} // DEC: {inspectedGlyph.charCodeAt(0)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setInspectedGlyph(null)}
                            className="text-[10px] text-[#758091] hover:text-[#F4F5F7]"
                          >
                            DISMISS
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Type Scale Ladder */}
                    <div className="space-y-3 pt-4 border-t border-[#1E232E]">
                      <span className="text-xs font-semibold text-[#F4F5F7] block">
                        MATHEMATICAL TYPE SCALE LADDER (PT PROGRESSION)
                      </span>
                      <div className="space-y-2 p-3 bg-[#070809] border border-[#1E232E]">
                        {scaleRhythm.map((pt) => (
                          <div key={pt} className="flex items-baseline gap-4 py-1 border-b border-[#141820] last:border-none">
                            <span className="w-12 text-[10px] text-[#00FF66] font-mono-code shrink-0">
                              {pt}px
                            </span>
                            <div 
                              className="truncate text-[#F4F5F7]"
                              style={{
                                fontFamily: specimen.primaryFontName === 'Plus Jakarta Sans' ? "'Plus Jakarta Sans', sans-serif" :
                                            specimen.primaryFontName === 'JetBrains Mono' ? "'JetBrains Mono', monospace" :
                                            specimen.primaryFontName === 'Playfair Display' ? "'Playfair Display', serif" :
                                            specimen.primaryFontName === 'Syne' ? "'Syne', sans-serif" :
                                            specimen.primaryFontName === 'Major Mono Display' ? "'Major Mono Display', monospace" :
                                            specimen.primaryFontName === 'Cinzel' ? "'Cinzel', serif" : "'Space Grotesk', sans-serif",
                                fontSize: `${pt}px`,
                                lineHeight: 1.1
                              }}
                            >
                              Typographic Discipline & Vector Tension
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Historical Notes & OpenType Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1E232E] text-xs">
                      <div className="p-3 bg-[#070809] border border-[#1E232E] space-y-1.5">
                        <span className="text-[11px] font-bold text-[#00FF66] flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" /> HISTORICAL CONTEXT
                        </span>
                        <p className="text-[11px] text-[#8C98AC] leading-relaxed">
                          {specimen.historicalNotes}
                        </p>
                      </div>

                      <div className="p-3 bg-[#070809] border border-[#1E232E] space-y-1.5">
                        <span className="text-[11px] font-bold text-[#F4F5F7] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" /> OPENTYPE FEATURES ACTIVE
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {specimen.openTypeHighlights.map((feat, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#141822] text-[#00FF66] border border-[#232B3C] text-[10px]">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
};
