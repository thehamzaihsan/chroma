'use client';

import { useState, useRef } from 'react';
import { Type, Upload, X, Search } from 'lucide-react';
import { useStore } from '@/store';

const googleFonts = [
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif' },
  { name: 'Work Sans', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'PT Serif', category: 'serif' },
  { name: 'Noto Serif', category: 'serif' },
  { name: 'Crimson Text', category: 'serif' },
  { name: 'Source Serif Pro', category: 'serif' },
  { name: 'Fira Code', category: 'monospace' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace' },
  { name: 'Roboto Mono', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
  { name: 'Space Mono', category: 'monospace' },
  { name: 'Oswald', category: 'sans-serif' },
  { name: 'Bebas Neue', category: 'sans-serif' },
  { name: 'Anton', category: 'sans-serif' },
  { name: 'Quicksand', category: 'sans-serif' },
  { name: 'Rubik', category: 'sans-serif' },
  { name: 'Karla', category: 'sans-serif' },
  { name: 'Inconsolata', category: 'monospace' },
  { name: 'Ubuntu Mono', category: 'monospace' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'DM Sans', category: 'sans-serif' },
  { name: 'Outfit', category: 'sans-serif' },
  { name: 'Sora', category: 'sans-serif' },
  { name: 'Manrope', category: 'sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'sans-serif' },
  { name: 'Cabinet Grotesk', category: 'sans-serif' },
  { name: 'Satoshi', category: 'sans-serif' },
  { name: 'General Sans', category: 'sans-serif' },
  { name: 'Clash Display', category: 'sans-serif' },
  { name: 'Syne', category: 'sans-serif' },
  { name: 'Fraunces', category: 'serif' },
  { name: 'Newsreader', category: 'serif' },
  { name: 'Instrument Serif', category: 'serif' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', category: 'monospace' },
  { name: 'Cascadia Code', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
];

interface CustomFont {
  name: string;
  family: string;
  url: string;
}

export function FontSelector() {
  const { settings, updateSettings } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFont = settings.font || 'Inter';

  const filteredFonts = googleFonts.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || f.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleFontSelect = (fontName: string) => {
    updateSettings({ font: fontName, fontUrl: `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap` });
  };

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontUrl = event.target?.result as string;
        const fontName = file.name.replace(/\.[^/.]+$/, '');
        
        const newFont: CustomFont = {
          name: fontName,
          family: fontName,
          url: fontUrl,
        };
        
        setCustomFonts(prev => [...prev, newFont]);
        
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${fontName}';
            src: url('${fontUrl}');
          }
        `;
        document.head.appendChild(style);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveCustomFont = (index: number) => {
    setCustomFonts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Type size={20} className="text-accent" />
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Typography</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCategory(null)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!category ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          All
        </button>
        <button
          onClick={() => setCategory('sans-serif')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${category === 'sans-serif' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          Sans
        </button>
        <button
          onClick={() => setCategory('serif')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${category === 'serif' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          Serif
        </button>
        <button
          onClick={() => setCategory('monospace')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${category === 'monospace' ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'}`}
        >
          Mono
        </button>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-3 py-1.5 text-xs rounded-lg bg-bg-tertiary text-text-secondary hover:bg-bg-elevated transition-colors flex items-center gap-1"
        >
          <Upload size={12} />
          Custom
        </button>
      </div>

      {showUpload && (
        <div className="mb-4 p-4 rounded-xl bg-bg-tertiary border border-dashed border-border">
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            multiple
            onChange={handleCustomFontUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Upload size={16} />
            Upload TTF, OTF, WOFF, WOFF2
          </button>
          {customFonts.length > 0 && (
            <div className="mt-3 space-y-2">
              {customFonts.map((font, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-bg-elevated">
                  <span className="text-sm font-medium" style={{ fontFamily: font.family }}>{font.name}</span>
                  <button onClick={() => handleRemoveCustomFont(index)} className="p-1 hover:bg-bg-tertiary rounded">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search fonts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bg-tertiary border border-border focus:border-accent focus:outline-none text-sm"
        />
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredFonts.map((font) => (
          <button
            key={font.name}
            onClick={() => handleFontSelect(font.name)}
            className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
              selectedFont === font.name
                ? 'bg-accent/20 text-accent'
                : 'hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            <span style={{ fontFamily: font.name }}>{font.name}</span>
            <span className="text-xs text-text-muted">{font.category}</span>
          </button>
        ))}
      </div>

      {customFonts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs text-text-muted uppercase mb-2">Custom Fonts</h4>
          <div className="space-y-1">
            {customFonts.map((font, index) => (
              <button
                key={index}
                onClick={() => handleFontSelect(font.family)}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                  selectedFont === font.family
                    ? 'bg-accent/20 text-accent'
                    : 'hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                <span style={{ fontFamily: font.family }}>{font.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}