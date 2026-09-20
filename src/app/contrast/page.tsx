'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/Button';
import { getContrastRatio, meetsWCAG } from '@/lib/colors';
import { HexColorPicker } from 'react-colorful';

export default function ContrastPage() {
  const { currentPalette } = useStore();
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#000000');

  const ratio = getContrastRatio(fgColor, bgColor);
  const aaSmall = meetsWCAG(ratio, 'AA', false);
  const aaLarge = meetsWCAG(ratio, 'AA', true);
  const aaaSmall = meetsWCAG(ratio, 'AAA', false);
  const aaaLarge = meetsWCAG(ratio, 'AAA', true);

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const getRatioColor = (r: number) => {
    if (r >= 7) return 'text-success';
    if (r >= 4.5) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold font-heading">Contrast Checker</h1>
          <p className="text-sm text-text-muted">Check WCAG accessibility compliance</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Foreground</h3>
                <Button variant="ghost" size="sm" onClick={swapColors}>
                  Swap
                </Button>
              </div>
              <div className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded-xl border border-border"
                  style={{ backgroundColor: fgColor }}
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-bg-tertiary border border-border font-mono"
                />
              </div>
              <div className="mt-4">
                <HexColorPicker color={fgColor} onChange={setFgColor} style={{ width: '100%' }} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Background</h3>
              <div className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded-xl border border-border"
                  style={{ backgroundColor: bgColor }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-bg-tertiary border border-border font-mono"
                />
              </div>
              <div className="mt-4">
                <HexColorPicker color={bgColor} onChange={setBgColor} style={{ width: '100%' }} />
              </div>
            </div>

            {currentPalette && (
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Quick Select from Palette</h3>
                <div className="flex gap-2 flex-wrap">
                  {currentPalette.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setFgColor(color.hex)}
                      className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-accent transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} - Foreground`}
                    />
                  ))}
                  <div className="w-px h-10 bg-border mx-2" />
                  {currentPalette.colors.map((color) => (
                    <button
                      key={`bg-${color.id}`}
                      onClick={() => setBgColor(color.hex)}
                      className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-accent transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} - Background`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-bg-secondary border border-border text-center">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">Contrast Ratio</h3>
              <p className={`text-7xl font-bold font-heading ${getRatioColor(ratio)}`}>
                {ratio.toFixed(2)}:1
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">WCAG AA</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Normal Text</span>
                    {aaSmall ? (
                      <span className="flex items-center gap-1 text-success"><Check size={16} /> Pass</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error"><X size={16} /> Fail</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Large Text</span>
                    {aaLarge ? (
                      <span className="flex items-center gap-1 text-success"><Check size={16} /> Pass</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error"><X size={16} /> Fail</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">WCAG AAA</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Normal Text</span>
                    {aaaSmall ? (
                      <span className="flex items-center gap-1 text-success"><Check size={16} /> Pass</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error"><X size={16} /> Fail</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Large Text</span>
                    {aaaLarge ? (
                      <span className="flex items-center gap-1 text-success"><Check size={16} /> Pass</span>
                    ) : (
                      <span className="flex items-center gap-1 text-error"><X size={16} /> Fail</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Preview</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: bgColor }}>
                  <p className="text-sm" style={{ color: fgColor }}>
                    Small text sample (14px) - The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: bgColor }}>
                  <p className="text-lg font-bold" style={{ color: fgColor }}>
                    Large text sample (18px bold) - The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: bgColor }}>
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: fgColor, color: bgColor }}
                  >
                    Button Sample
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
