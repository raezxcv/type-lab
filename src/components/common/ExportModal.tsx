import React, { useState } from 'react';
import type { TypographicState } from '../../types';
import { X, Download, Copy, Check, Code, FileText, Image as ImageIcon } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: TypographicState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  state,
  canvasRef,
}) => {
  const [exporting, setExporting] = useState(false);
  const [copiedType, setCopiedType] = useState<'css' | 'tailwind' | 'json' | null>(null);

  if (!isOpen) return null;

  // Generate CSS rules
  const cssRules = `/* TYPE//LAB 11 Specimen Export */
.specimen-text {
  font-family: ${state.fontFamily};
  font-size: ${state.fontSize}px;
  font-weight: ${state.fontWeight};
  font-style: ${state.isItalic ? 'italic' : 'normal'};
  letter-spacing: ${state.letterSpacing}em;
  line-height: ${state.lineHeight};
  word-spacing: ${state.wordSpacing}em;
  text-align: ${state.textAlign};
  text-transform: ${state.textTransform};
  color: ${state.textColor};
  background-color: ${state.backgroundColor};
  ${state.strokeWidth > 0 ? `-webkit-text-stroke: ${state.strokeWidth}px ${state.strokeColor};` : ''}
  ${state.isVertical ? `writing-mode: vertical-rl;` : ''}
  transform: skewX(${state.skew}deg) rotate(${state.rotation}deg);
  ${state.textShadow ? `text-shadow: 0 0 24px ${state.shadowGlowColor};` : ''}
}`;

  // Generate Tailwind equivalent
  const tailwindSnippet = `<!-- Tailwind CSS & Inline style equivalent -->
<div 
  class="${state.isItalic ? 'italic' : ''} ${state.textTransform === 'uppercase' ? 'uppercase' : state.textTransform === 'lowercase' ? 'lowercase' : state.textTransform === 'capitalize' ? 'capitalize' : ''}"
  style={{
    fontFamily: "${state.fontFamily.replace(/['"]/g, '\\"')}",
    fontSize: "${state.fontSize}px",
    fontWeight: ${state.fontWeight},
    letterSpacing: "${state.letterSpacing}em",
    lineHeight: ${state.lineHeight},
    wordSpacing: "${state.wordSpacing}em",
    textAlign: "${state.textAlign}",
    color: "${state.textColor}",
    backgroundColor: "${state.backgroundColor}",
    ${state.strokeWidth > 0 ? `WebkitTextStroke: "${state.strokeWidth}px ${state.strokeColor}",` : ''}
    ${state.isVertical ? `writingMode: "vertical-rl",` : ''}
    transform: "skewX(${state.skew}deg) rotate(${state.rotation}deg)"
  }}
>
  ${state.text.replace(/\n/g, '<br />')}
</div>`;

  const jsonSnippet = JSON.stringify(state, null, 2);

  const handleCopy = (text: string, type: 'css' | 'tailwind' | 'json') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadPNG = async () => {
    if (!canvasRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution retina 2x
      });

      const link = document.createElement('a');
      link.download = `typelab11-specimen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Trigger celebrate confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00FF66', '#FFFFFF', '#141619'],
      });
    } catch (err) {
      console.error('Failed to export PNG', err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSVG = async () => {
    if (!canvasRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toSvg(canvasRef.current);
      const link = document.createElement('a');
      link.download = `typelab11-specimen-${Date.now()}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export SVG', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070809]/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-[#0D0F14] border border-[#22262E] shadow-2xl p-6 sm:p-8 font-mono-code text-xs text-[#F4F5F7] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22262E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00FF66]"></span>
            <h2 id="export-modal-title" className="text-sm font-bold tracking-wider uppercase text-[#F4F5F7]">
              EXPORT TYPOGRAPHIC COMPOSITION
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

        {/* Export Action Buttons */}
        <div className="py-6 space-y-4">
          <div className="text-[11px] text-[#758091]">
            SELECT EXPORT FORMAT (RASTER GRAPHIC, VECTOR, OR FRONTEND CODE):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download PNG High-Res */}
            <button
              onClick={handleDownloadPNG}
              disabled={exporting}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#00FF66] hover:bg-[#4DFF95] text-[#070809] font-bold transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{exporting ? 'RASTERIZING...' : 'DOWNLOAD HIGH-RES PNG (2X)'}</span>
            </button>

            {/* Download SVG */}
            <button
              onClick={handleDownloadSVG}
              disabled={exporting}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#171B24] hover:bg-[#232A38] text-[#F4F5F7] border border-[#2E3646] font-bold transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#00FF66]" />
              <span>DOWNLOAD SVG VECTOR</span>
            </button>
          </div>

          {/* CSS Rules Export Box */}
          <div className="pt-4 space-y-2 border-t border-[#1E232E]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8C98AC] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#00FF66]" />
                STANDALONE CSS STYLESHEET
              </span>
              <button
                onClick={() => handleCopy(cssRules, 'css')}
                className="flex items-center gap-1 text-[11px] text-[#00FF66] hover:underline"
              >
                {copiedType === 'css' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedType === 'css' ? 'COPIED!' : 'COPY CSS'}
              </button>
            </div>
            <pre className="p-3 bg-[#08090C] border border-[#1A1F29] text-[11px] text-[#8C98AC] overflow-x-auto selection:bg-[#00FF66] selection:text-black">
              <code>{cssRules}</code>
            </pre>
          </div>

          {/* Tailwind / JSX Export Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8C98AC] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#00FF66]" />
                REACT / JSX COMPONENT SNIPPET
              </span>
              <button
                onClick={() => handleCopy(tailwindSnippet, 'tailwind')}
                className="flex items-center gap-1 text-[11px] text-[#00FF66] hover:underline"
              >
                {copiedType === 'tailwind' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedType === 'tailwind' ? 'COPIED!' : 'COPY JSX'}
              </button>
            </div>
            <pre className="p-3 bg-[#08090C] border border-[#1A1F29] text-[11px] text-[#8C98AC] overflow-x-auto max-h-32">
              <code>{tailwindSnippet}</code>
            </pre>
          </div>

          {/* JSON Preset Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8C98AC] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#00FF66]" />
                SPECIMEN STATE JSON (FOR RESTORE/SHARING)
              </span>
              <button
                onClick={() => handleCopy(jsonSnippet, 'json')}
                className="flex items-center gap-1 text-[11px] text-[#00FF66] hover:underline"
              >
                {copiedType === 'json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedType === 'json' ? 'COPIED!' : 'COPY JSON'}
              </button>
            </div>
            <pre className="p-3 bg-[#08090C] border border-[#1A1F29] text-[10px] text-[#8C98AC] overflow-x-auto max-h-24">
              <code>{jsonSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#22262E] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#171B24] hover:bg-[#202735] text-[#F4F5F7] border border-[#2B3342] transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
