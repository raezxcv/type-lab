import React, { useState } from 'react';
import { ANATOMY_POINTS } from '../../data/anatomy';
import { GLOSSARY_TERMS } from '../../data/glossary';
import type { AnatomyPoint } from '../../types';
import { 
  Search, 
  Terminal
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [selectedAnatomy, setSelectedAnatomy] = useState<AnatomyPoint>(ANATOMY_POINTS[0]);
  const [glossaryCategory, setGlossaryCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Type Scale Calculator State
  const [baseSize, setBaseSize] = useState<number>(16);
  const [selectedRatio, setSelectedRatio] = useState<number>(1.25); // Major Third

  const ratios = [
    { name: 'Minor Second', value: 1.067, ratio: '15:16' },
    { name: 'Major Second', value: 1.125, ratio: '8:9' },
    { name: 'Minor Third', value: 1.200, ratio: '5:6' },
    { name: 'Major Third', value: 1.250, ratio: '4:5' },
    { name: 'Augmented Fourth', value: 1.414, ratio: '1:√2 (DIN A4)' },
    { name: 'Perfect Fifth', value: 1.500, ratio: '2:3' },
    { name: 'Golden Ratio', value: 1.618, ratio: '1:1.618 (Phi)' },
  ];

  // Calculate 6 steps of scale
  const calculatedSteps = [-1, 0, 1, 2, 3, 4, 5].map((step) => {
    const size = Math.round(baseSize * Math.pow(selectedRatio, step));
    return {
      step,
      size,
      rem: (size / 16).toFixed(3),
      label: step === 0 ? 'Base Body' : step === -1 ? 'Micro Caption' : `Display H${6 - step > 0 ? 6 - step : 1}`
    };
  });

  const glossaryCategories = ['All', 'Metrics', 'Anatomy', 'Typesetting', 'Digital Typography'];

  const filteredGlossary = GLOSSARY_TERMS.filter((term) => {
    const matchesCat = glossaryCategory === 'All' || term.category === glossaryCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#070809] text-[#F4F5F7] font-mono-code pb-24">
      
      {/* Header Manifesto Banner */}
      <section className="relative border-b border-[#22262E] bg-[#0A0C10] py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 swiss-grid-pattern opacity-30 pointer-events-none" />
        
        {/* Photographic background accent */}
        <div 
          className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-cover bg-center pointer-events-none hidden lg:block"
          style={{ backgroundImage: `url('/images/macro-ink-interference-plate.jpg')` }}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#00FF66] font-bold">
            <span className="w-2 h-2 bg-[#00FF66] inline-block"></span>
            <span>CODEX & DESIGN PHILOSOPHY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-space font-black tracking-tighter uppercase text-[#F4F5F7]">
            THE DIGITAL TYPE LAB
          </h1>

          <p className="max-w-[65ch] text-sm sm:text-base text-[#C2CAD8] font-mono-code leading-relaxed">
            Bridging the mathematical discipline of 1960s Swiss Modernism with 21st-century dynamic vector engines. 
            A laboratory dedicated to the tactile anatomy, kinetic mechanics, and mathematical scales of typographic form.
          </p>
        </div>
      </section>

      {/* SECTION 1: MANIFESTO & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#22262E]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-2.5 py-1 bg-[#142319] border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold">
              PRINCIPLE 01 // ORTHOGONAL DISCIPLINE
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-space font-bold uppercase text-[#F4F5F7] tracking-tight">
              Order is the Prerequisite of Optical Clarity
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#D1D5DB] leading-relaxed max-w-[65ch]">
              <p>
                In 1957, when Max Miedinger and Eduard Hoffmann cut Neue Haas Grotesk in Münchenstein, Switzerland, they sought a typeface that removed personal idiosyncrasies in favor of absolute transparency and neutral communication.
              </p>
              <p>
                Simultaneously, Josef Müller-Brockmann and Emil Ruder articulated the <strong className="text-[#F4F5F7]">Raster Systeme (Grid System)</strong>: an orthogonal mathematical coordinate matrix that frees the designer from arbitrary composition.
              </p>
              <p>
                In the digital era, typography is no longer cast in hot metal lead or frozen on a lithographic plate. Letterforms are dynamic mathematical Bézier curves undergoing continuous kinetic transformation across infinite viewport densities.
              </p>
            </div>

            {/* Quote block */}
            <blockquote className="p-4 bg-[#0E1117] border-l-2 border-[#00FF66] text-xs italic text-[#C2CAD8] space-y-2">
              <p>&ldquo;The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to their personal style.&rdquo;</p>
              <footer className="text-[10px] text-[#00FF66] font-mono-code not-italic font-bold">
                — Josef Müller-Brockmann, Grid Systems in Graphic Design (1961)
              </footer>
            </blockquote>
          </div>

          <div className="lg:col-span-7 border border-[#22262E] bg-[#0E1117] p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF66]/5 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#1E232E] pb-3 text-xs">
              <span className="font-bold text-[#F4F5F7] uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FF66]" />
                THE THREE AXIOMS OF TYPE//LAB 11
              </span>
              <span className="text-[#00FF66] text-[10px]">AXIOMS//2026</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#070809] border border-[#1A1F29] space-y-1.5">
                <span className="font-bold text-[#00FF66] text-[11px]">01 // TYPE AS ARCHITECTURE</span>
                <p className="text-[#8C98AC] leading-relaxed">
                  Typography is not secondary decoration pasted over a wireframe. The character glyphs, their counters, their tracking, and their baseline grid <em className="text-[#F4F5F7]">are</em> the architectural space itself.
                </p>
              </div>

              <div className="p-4 bg-[#070809] border border-[#1A1F29] space-y-1.5">
                <span className="font-bold text-[#00FF66] text-[11px]">02 // TACTILE TELEMETRY</span>
                <p className="text-[#8C98AC] leading-relaxed">
                  Every slider and button in this laboratory updates the rendered typography instantaneously without buffering, giving designers physical-like intuition over optical weight and tracking.
                </p>
              </div>

              <div className="p-4 bg-[#070809] border border-[#1A1F29] space-y-1.5">
                <span className="font-bold text-[#00FF66] text-[11px]">03 // SUBVERSIVE EXPERIMENTATION</span>
                <p className="text-[#8C98AC] leading-relaxed">
                  Classic Swiss rules were made to be mastered, and once mastered, deliberately pushed into extreme tension: negative tracking that collides stems, hyper-extended kinetic marquees, and optical contrast subversions.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: INTERACTIVE ANATOMY OF TYPOGRAPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#22262E]">
        <div className="space-y-4 mb-8">
          <div className="inline-block px-2.5 py-1 bg-[#142319] border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold">
            INTERACTIVE SCHEMATIC // 02
          </div>
          <h2 className="text-2xl sm:text-4xl font-space font-black uppercase text-[#F4F5F7]">
            ANATOMY OF THE LETTERFORM
          </h2>
          <p className="text-xs text-[#8C98AC] max-w-xl">
            Click on any radar pin across the letterform schematic to inspect its anatomical definition and layout significance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Letter Diagram Artboard */}
          <div className="lg:col-span-7 bg-[#0A0C10] border border-[#22262E] p-8 sm:p-12 relative flex items-center justify-center min-h-[420px] overflow-hidden select-none">
            {/* Guide grid lines */}
            <div className="absolute inset-0 swiss-grid-pattern opacity-30" />

            {/* Ascender Guide */}
            <div className="absolute top-[16%] left-0 right-0 border-b border-dashed border-[#00FF66]/40 flex justify-between px-3 text-[9px] text-[#00FF66]">
              <span>ASCENDER LINE</span>
              <span>y = 0.88 em</span>
            </div>

            {/* Cap Height Guide */}
            <div className="absolute top-[28%] left-0 right-0 border-b border-dashed border-[#758091]/40 flex justify-between px-3 text-[9px] text-[#758091]">
              <span>CAP HEIGHT</span>
              <span>y = 0.72 em</span>
            </div>

            {/* Mean Line (x-Height) Guide */}
            <div className="absolute top-[48%] left-0 right-0 border-b border-dashed border-[#00FF66]/40 flex justify-between px-3 text-[9px] text-[#00FF66]">
              <span>MEAN LINE (x-HEIGHT)</span>
              <span>y = 0.52 em</span>
            </div>

            {/* Baseline Guide */}
            <div className="absolute bottom-[28%] left-0 right-0 border-b-2 border-[#00FF66] flex justify-between px-3 text-[9px] text-[#00FF66] font-bold">
              <span>BASELINE (GROUND PLANE)</span>
              <span>y = 0.00 em</span>
            </div>

            {/* Descender Guide */}
            <div className="absolute bottom-[10%] left-0 right-0 border-b border-dashed border-[#758091]/40 flex justify-between px-3 text-[9px] text-[#758091]">
              <span>DESCENDER LINE</span>
              <span>y = -0.24 em</span>
            </div>

            {/* Monolithic Letterforms Display */}
            <div className="relative z-10 flex items-baseline justify-center gap-4 text-[130px] sm:text-[180px] font-space font-bold leading-none tracking-tight text-[#F4F5F7] opacity-90">
              <span className="text-[#F4F5F7]">R</span>
              <span className="text-[#00FF66]">g</span>
              <span className="text-[#F4F5F7]">h</span>
            </div>

            {/* Interactive Radar Pins */}
            {ANATOMY_POINTS.map((point) => {
              const isSelected = selectedAnatomy.id === point.id;
              return (
                <button
                  key={point.id}
                  onClick={() => setSelectedAnatomy(point)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  style={{ left: `${point.xPercent}%`, top: `${point.yPercent}%` }}
                  title={point.label}
                  aria-label={`Inspect ${point.label}`}
                >
                  <div className={`relative flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-125' : 'group-hover:scale-110'
                  }`}>
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      isSelected 
                        ? 'bg-[#00FF66] text-[#070809] border-[#00FF66] shadow-[0_0_12px_#00FF66]' 
                        : 'bg-[#0E1117] text-[#00FF66] border-[#00FF66]/60 hover:bg-[#16261B]'
                    }`}>
                      +
                    </span>
                    <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-mono-code px-1 bg-[#070809] border border-[#22262E] text-[#C2CAD8] opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inspected Anatomy Detail Panel */}
          <div className="lg:col-span-5 bg-[#0E1117] border border-[#22262E] p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E232E] pb-3 text-xs">
                <span className="text-[#00FF66] font-bold uppercase tracking-wider">
                  ANATOMICAL TELEMETRY
                </span>
                <span className="text-[10px] text-[#758091]">PIN: {selectedAnatomy.id.toUpperCase()}</span>
              </div>

              <div>
                <span className="text-xs text-[#758091] block">FEATURE TERM</span>
                <h3 className="text-xl sm:text-2xl font-space font-bold text-[#F4F5F7] mt-0.5">
                  {selectedAnatomy.term}
                </h3>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-[#00FF66]">DEFINITION</span>
                <p className="text-xs text-[#8C98AC] leading-relaxed">
                  {selectedAnatomy.definition}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#1E232E]">
                <span className="text-[11px] font-semibold text-[#F4F5F7]">STRUCTURAL SIGNIFICANCE</span>
                <p className="text-xs text-[#8C98AC] leading-relaxed">
                  {selectedAnatomy.significance}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E232E] flex items-center justify-between text-[10px] text-[#556072]">
              <span>SELECT PINS TO REVEAL SPECIFICATIONS</span>
              <span className="text-[#00FF66]">DIN 1450 A11Y STANDARD</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: MODULAR TYPE SCALE CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#22262E]">
        <div className="space-y-4 mb-8">
          <div className="inline-block px-2.5 py-1 bg-[#142319] border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold">
            MATHEMATICAL TOOL // 03
          </div>
          <h2 className="text-2xl sm:text-4xl font-space font-black uppercase text-[#F4F5F7]">
            MODULAR TYPE SCALE CALCULATOR
          </h2>
          <p className="text-xs text-[#8C98AC] max-w-xl">
            Mathematical harmonic ratios produce consistent typographic scale progressions. Select a musical interval or geometric ratio to compute your scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls column */}
          <div className="lg:col-span-4 bg-[#0E1117] border border-[#22262E] p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#758091] block">
                BASE BODY SIZE (PX)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  max="32"
                  value={baseSize}
                  onChange={(e) => setBaseSize(Number(e.target.value))}
                  className="w-20 bg-[#070809] border border-[#22262E] focus:border-[#00FF66] text-[#00FF66] p-2 text-sm font-bold text-center"
                />
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={baseSize}
                  onChange={(e) => setBaseSize(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#1E232E]">
              <label className="text-xs font-semibold text-[#758091] block">
                HARMONIC RATIO / INTERVAL
              </label>
              <div className="space-y-1.5">
                {ratios.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRatio(r.value)}
                    className={`w-full flex items-center justify-between p-2.5 text-xs text-left border transition-all ${
                      selectedRatio === r.value
                        ? 'border-[#00FF66] bg-[#14261B] text-[#00FF66] font-bold'
                        : 'border-[#1C212B] bg-[#070809] text-[#758091] hover:text-[#F4F5F7]'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className="text-[10px] font-mono-code opacity-80">{r.ratio} ({r.value})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visual Scale Ladder */}
          <div className="lg:col-span-8 bg-[#0E1117] border border-[#22262E] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E232E] pb-3 text-xs">
              <span className="text-[#00FF66] font-bold">
                COMPUTED SCALE PROGRESSION ({selectedRatio}x)
              </span>
              <span className="text-[#758091] text-[10px]">7 PROGRESSION NODES</span>
            </div>

            <div className="space-y-3">
              {calculatedSteps.map((item) => (
                <div 
                  key={item.step} 
                  className="p-3 bg-[#070809] border border-[#1A1F29] flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 overflow-hidden"
                >
                  <div className="flex items-baseline gap-3 shrink-0">
                    <span className="w-16 text-xs text-[#00FF66] font-bold">
                      {item.size}px
                    </span>
                    <span className="text-[10px] text-[#758091]">
                      {item.rem}rem // {item.label}
                    </span>
                  </div>

                  <div 
                    className="truncate text-[#F4F5F7] font-space font-medium"
                    style={{ fontSize: `${item.size}px`, lineHeight: 1.1 }}
                  >
                    Typographic Harmony
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: TYPOGRAPHIC REFERENCE GLOSSARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4 mb-8">
          <div className="inline-block px-2.5 py-1 bg-[#142319] border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold">
            REFERENCE CODEX // 04
          </div>
          <h2 className="text-2xl sm:text-4xl font-space font-black uppercase text-[#F4F5F7]">
            TYPOGRAPHIC REFERENCE LEXICON
          </h2>
          <p className="text-xs text-[#8C98AC] max-w-xl">
            A comprehensive reference dictionary of typographic terminology, historical origins, and mathematical best practices.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#758091] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH TYPOGRAPHIC TERMS (e.g. KERNING, LEADING, INK TRAPS)..."
                className="w-full bg-[#11141A] border border-[#272F3E] focus:border-[#00FF66] text-[#F4F5F7] pl-9 pr-4 py-2.5 text-xs font-mono-code rounded-none focus:outline-none placeholder-[#4E5868]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {glossaryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGlossaryCategory(cat)}
                  className={`px-3 py-2 text-[11px] font-mono-code uppercase transition-all whitespace-nowrap border ${
                    glossaryCategory === cat
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

        {/* Glossary Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGlossary.map((item, idx) => (
            <article 
              key={idx}
              className="p-6 bg-[#0E1117] border border-[#22262E] space-y-3 hover:border-[#00FF66]/50 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-[#1E232E] pb-2">
                <span className="text-[10px] px-2 py-0.5 bg-[#142319] text-[#00FF66] border border-[#00FF66]/30 font-bold">
                  {item.category.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#4E5868]">LEX_REF #{idx + 1}</span>
              </div>

              <h3 className="text-lg font-space font-bold text-[#F4F5F7]">
                {item.term}
              </h3>

              <p className="text-xs text-[#8C98AC] leading-relaxed">
                {item.definition}
              </p>

              <div className="pt-2 text-[11px] text-[#556072] space-y-1">
                <div>
                  <strong className="text-[#8C98AC]">Context:</strong> {item.etymologyOrContext}
                </div>
                {item.formulaOrRule && (
                  <div className="text-[#00FF66]">
                    <strong className="text-[#00FF66]">Rule:</strong> {item.formulaOrRule}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5: COLOPHON & SPECIFICATIONS */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[#22262E] text-xs text-[#758091] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-mono-code text-[11px]">
          <div>
            <span className="text-[#F4F5F7] font-bold block mb-2">PROJECT METRICS</span>
            <p>Challenge: 20-Day Digital Design</p>
            <p>Project: 11 — Type Playground</p>
            <p>Engine: TYPE//LAB v2.4</p>
          </div>
          <div>
            <span className="text-[#F4F5F7] font-bold block mb-2">STACK ARCHITECTURE</span>
            <p>React 19 + TypeScript</p>
            <p>Tailwind CSS v4 Engine</p>
            <p>Vite + html-to-image</p>
          </div>
          <div>
            <span className="text-[#F4F5F7] font-bold block mb-2">TYPOGRAPHY REPERTOIRE</span>
            <p>Space Grotesk, Syne, Plus Jakarta</p>
            <p>JetBrains Mono, Space Mono</p>
            <p>Playfair, Cinzel, Major Mono</p>
          </div>
          <div>
            <span className="text-[#F4F5F7] font-bold block mb-2">GRAPHIC ASSETS</span>
            <p>Original Darkroom Photogram</p>
            <p>Swiss Concrete Shadow Study</p>
            <p>Macro Lithographic Ink Emulsion</p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E232E] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#4E5868]">
          <span>© 2026 TYPE//LAB 11. INDEPENDENT MULTIDISCIPLINARY DIGITAL DESIGN STUDIO.</span>
          <span className="text-[#00FF66]">DESIGNED FOR THE 20-DAY DIGITAL DESIGN CHALLENGE</span>
        </div>
      </footer>

    </div>
  );
};
