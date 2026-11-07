import React, { useState, useRef } from 'react';
import type { FontDefinition } from '../../types';
import { Search, Upload, X, Check } from 'lucide-react';

interface VisualFontPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFontFamily: string;
  onSelectFont: (font: FontDefinition) => void;
  fonts: FontDefinition[];
  onUploadCustomFont: (font: FontDefinition) => void;
  title?: string;
}

export const VisualFontPicker: React.FC<VisualFontPickerProps> = ({
  isOpen,
  onClose,
  selectedFontFamily,
  onSelectFont,
  fonts,
  onUploadCustomFont,
  title = 'SELECT TYPEFACE',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const categories = ['all', 'grotesk', 'serif', 'monospace', 'display', 'experimental', 'custom'];

  const filteredFonts = fonts.filter((f) => {
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.designer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9 ]/g, ' ');
      const cssFontFamily = `'${fontName}', sans-serif`;

      const fontFace = new FontFace(fontName, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);

      const newFont: FontDefinition = {
        id: `custom-${Date.now()}`,
        name: fontName,
        cssFamily: cssFontFamily,
        category: 'custom',
        weights: [400, 700],
        origin: 'User Local File',
        designer: 'Custom Upload',
        bestUse: 'Custom Typographic Testing',
        sampleText: 'CUSTOM LOADED TYPEFACE'
      };

      onUploadCustomFont(newFont);
      onSelectFont(newFont);
      onClose();
    } catch (err) {
      console.error('Failed to load custom font file', err);
      alert('Could not parse font file. Please provide a valid .ttf, .otf, or .woff file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070809]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl bg-[#0D0F14] border border-[#22262E] shadow-2xl p-6 font-mono-code text-xs text-[#F4F5F7] max-h-[85vh] flex flex-col"
        role="dialog"
        aria-labelledby="font-picker-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22262E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66]"></span>
            <h2 id="font-picker-title" className="text-sm font-bold tracking-wider uppercase text-[#F4F5F7]">
              {title} ({fonts.length} TYPEFACES)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#758091] hover:text-[#F4F5F7] hover:bg-[#1A1F29] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search, Categories, and Upload Action */}
        <div className="py-4 space-y-3 border-b border-[#1E232E]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#758091] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search typefaces by name, category, or designer..."
                className="w-full bg-[#11141A] border border-[#272F3E] focus:border-[#00FF66] text-[#00FF66] pl-9 pr-3 py-2 text-xs font-mono-code rounded-none focus:outline-none placeholder-[#4E5868]"
                autoFocus
              />
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#142319] hover:bg-[#1E3627] text-[#00FF66] border border-[#00FF66]/40 font-bold text-xs transition-colors whitespace-nowrap"
                title="Upload local .ttf, .otf, or .woff file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>UPLOAD FONT</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] uppercase font-bold border transition-colors ${
                  categoryFilter === cat
                    ? 'border-[#00FF66] bg-[#16221C] text-[#00FF66]'
                    : 'border-[#22262E] bg-[#0D0F14] text-[#A1A1AA] hover:text-[#F4F5F7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Font List / Grid with Actual Font Rendering */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {filteredFonts.length === 0 ? (
            <div className="p-8 text-center text-[#758091] text-xs">
              No typefaces matched &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredFonts.map((font) => {
              const isSelected = selectedFontFamily === font.cssFamily;
              return (
                <button
                  key={font.id}
                  onClick={() => {
                    onSelectFont(font);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 border transition-all flex items-center justify-between gap-4 group ${
                    isSelected
                      ? 'border-[#00FF66] bg-[#142319]/80'
                      : 'border-[#1C212B] bg-[#0A0C10] hover:bg-[#121620] hover:border-[#384357]'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F4F5F7] group-hover:text-[#00FF66] transition-colors">
                        {font.name}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#171B24] text-[#00FF66] text-[11px] uppercase font-bold">
                        {font.category}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] text-[#00FF66] font-bold">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>
                    
                    {/* The Specimen Preview in its ACTUAL font! */}
                    <div 
                      className="text-lg sm:text-xl text-[#E2E8F0] truncate pt-0.5"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.sampleText || 'Abcdefghijklmnopqrstuvwxyz 0123456789'}
                    </div>

                    <div className="text-[11px] text-[#71717A] truncate">
                      {font.designer} // {font.bestUse}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[11px] text-[#71717A] block">
                      {font.weights.length} WEIGHTS
                    </span>
                    <span className="text-xs text-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      SELECT →
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#22262E] flex justify-between items-center text-xs text-[#758091]">
          <span>Tip: You can upload your own custom .ttf / .otf / .woff fonts anytime!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#2B3342] transition-colors"
          >
            CANCEL
          </button>
        </div>

      </div>
    </div>
  );
};
