'use client';

import { useState } from 'react';
import { Copy, Sun, Moon, Palette } from 'lucide-react';
import { useStore } from '@/store';
import { getColorFormats, getShades, lighten, darken } from '@/lib/colors';
import { HexColorPicker } from 'react-colorful';

export default function InspectorPage() {
  const { addToast } = useStore();
  const [hex, setHex] = useState('#6366F1');
  const [inputHex, setInputHex] = useState('#6366F1');

  const formats = getColorFormats(hex);
  const shades = getShades(hex);

  const handleInputChange = (value: string) => {
    setInputHex(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setHex(value);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied!`, 'success');
  };

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold font-heading">Color Inspector</h1>
          <p className="text-sm text-text-muted">Get detailed color information</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Pick a Color</h3>
              <div className="space-y-4">
                <div 
                  className="w-full h-40 rounded-xl border border-border"
                  style={{ backgroundColor: hex }}
                />
                <HexColorPicker color={hex} onChange={setHex} style={{ width: '100%' }} />
                <input
                  type="text"
                  value={inputHex}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onBlur={() => setHex(inputHex)}
                  placeholder="#000000"
                  className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border font-mono text-lg"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Color Name</h3>
              <p className="text-2xl font-heading font-bold">{formats.name || 'Custom'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Lighten & Darken</h3>
              <div className="grid grid-cols-2 gap-3">
                {[0.1, 0.2, 0.3].map((amount) => (
                  <button
                    key={`light-${amount}`}
                    onClick={() => copyToClipboard(lighten(hex, amount), `Lighten ${amount * 100}%`)}
                    className="p-4 rounded-xl border border-border hover:border-accent transition-colors"
                    style={{ backgroundColor: lighten(hex, amount) }}
                  >
                    <p className="text-xs font-mono">{lighten(hex, amount)}</p>
                    <p className="text-xs text-text-muted mt-1">+{amount * 100}%</p>
                  </button>
                ))}
                {[0.1, 0.2, 0.3].map((amount) => (
                  <button
                    key={`dark-${amount}`}
                    onClick={() => copyToClipboard(darken(hex, amount), `Darken ${amount * 100}%`)}
                    className="p-4 rounded-xl border border-border hover:border-accent transition-colors"
                    style={{ backgroundColor: darken(hex, amount) }}
                  >
                    <p className="text-xs font-mono">{darken(hex, amount)}</p>
                    <p className="text-xs text-text-muted mt-1">-{amount * 100}%</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Color Formats</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'HEX', value: formats.hex },
                  { label: 'RGB', value: formats.rgb },
                  { label: 'RGBA', value: formats.rgba },
                  { label: 'HSL', value: formats.hsl },
                  { label: 'HSLA', value: formats.hsla },
                  { label: 'CMYK', value: formats.cmyk },
                  { label: 'LAB', value: formats.lab },
                ].map(({ label, value }) => (
                  <div 
                    key={label}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary hover:bg-bg-elevated transition-colors cursor-pointer"
                    onClick={() => copyToClipboard(value, label)}
                  >
                    <span className="text-sm text-text-muted">{label}</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{value}</code>
                      <Copy size={14} className="text-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Shades</h3>
              <div className="flex h-16 rounded-xl overflow-hidden">
                {shades.map((shade) => (
                  <button
                    key={shade}
                    onClick={() => copyToClipboard(shade, 'Shade')}
                    className="flex-1 hover:scale-y-110 transition-transform"
                    style={{ backgroundColor: shade }}
                    title={shade}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>Light</span>
                <span>Dark</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Preview</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl" style={{ backgroundColor: hex }}>
                  <Palette size={20} className="text-white" />
                </div>
                <div className="p-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: hex }}>
                  <Sun size={20} className="text-white" />
                </div>
                <div className="p-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: hex }}>
                  <Moon size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
