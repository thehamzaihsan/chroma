'use client';

import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { Color } from '@/lib/types';
import { useStore } from '@/store';

const codeFormats = [
  { id: 'css', name: 'CSS', extension: 'css' },
  { id: 'tailwind', name: 'Tailwind', extension: 'js' },
  { id: 'scss', name: 'SCSS', extension: 'scss' },
  { id: 'json', name: 'JSON', extension: 'json' },
  { id: 'react', name: 'React/TypeScript', extension: 'tsx' },
  { id: 'flutter', name: 'Flutter/Dart', extension: 'dart' },
  { id: 'swift', name: 'Swift/SwiftUI', extension: 'swift' },
  { id: 'kotlin', name: 'Kotlin/Android', extension: 'kt' },
  { id: 'swiftui', name: 'SwiftUI Colors', extension: 'swift' },
  { id: 'css-modules', name: 'CSS Modules', extension: 'module.css' },
  { id: 'less', name: 'Less', extension: 'less' },
  { id: 'stylus', name: 'Stylus', extension: 'styl' },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generateCode(colors: Color[], format: string): string {
  const colorVars = colors.map((c, i) => {
    const rgb = hexToRgb(c.hex);
    const hsl = hexToHsl(c.hex);
    return { hex: c.hex.toUpperCase(), rgb, hsl, index: i + 1 };
  });

  switch (format) {
    case 'css':
      return `:root {\n${colorVars.map(c => `  --color-${c.index}: ${c.hex};\n  --color-${c.index}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`).join('\n')}\n}`;
    
    case 'tailwind':
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colorVars.map(c => `        'brand-${c.index}': '${c.hex}',\n        'brand-${c.index}-rgb': '${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}',`).join('\n')}\n      }\n    }\n  }\n}`;
    
    case 'scss':
      return `${colorVars.map(c => `$color-${c.index}: ${c.hex};`).join('\n')}\n\n${colorVars.map(c => `$color-${c.index}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`).join('\n')}`;
    
    case 'json':
      return JSON.stringify({
        palette: {
          name: "Generated Palette",
          colors: colorVars.map(c => ({
            name: `color-${c.index}`,
            hex: c.hex,
            rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
            hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
          }))
        }
      }, null, 2);
    
    case 'react':
      return `export const colors = {\n${colorVars.map(c => `  color${c.index}: '${c.hex}',`).join('\n')}\n};\n\nexport const rgbColors = {\n${colorVars.map(c => `  color${c.index}: { r: ${c.rgb.r}, g: ${c.rgb.g}, b: ${c.rgb.b} },`).join('\n')}\n};\n\nexport const theme = {\n  primary: '${colorVars[0]?.hex || ''}',\n  secondary: '${colorVars[1]?.hex || ''}',\n  accent: '${colorVars[2]?.hex || ''}',\n  background: '${colorVars[3]?.hex || ''}',\n  text: '${colorVars[4]?.hex || ''}',\n};`;
    
    case 'flutter':
      return `import 'package/flutter/material.dart';\n\nclass AppColors {\n${colorVars.map(c => `  static const Color color${c.index} = Color(0xFF${c.hex.replace('#', '')});`).join('\n')}\n\n  static const List<Color> palette = [\n${colorVars.map(c => `    color${c.index},`).join('\n')}\n  ];\n}`;
    
    case 'swift':
      return `import SwiftUI\n\nstruct AppColors {\n${colorVars.map(c => `  static let color${c.index} = Color(red: ${(c.rgb.r/255).toFixed(3)}, green: ${(c.rgb.g/255).toFixed(3)}, blue: ${(c.rgb.b/255).toFixed(3)})`).join('\n')}\n}`;
    
    case 'kotlin':
      return `object AppColors {\n${colorVars.map(c => `    val color${c.index} = Color(0xFF${c.hex.replace('#', '')})`).join('\n')}\n\n    val palette = listOf(\n${colorVars.map(c => `        color${c.index}`).join(',\n')}\n    )\n}`;
    
    case 'swiftui':
      return `extension Color {\n${colorVars.map(c => `  static let brandColor${c.index} = Color(red: ${(c.rgb.r/255).toFixed(3)}, green: ${(c.rgb.g/255).toFixed(3)}, blue: ${(c.rgb.b/255).toFixed(3)})`).join('\n')}\n}`;
    
    case 'css-modules':
      return `:root {\n${colorVars.map(c => `  --brand-${c.index}: ${c.hex};`).join('\n')}\n}`;
    
    case 'less':
      return `${colorVars.map(c => `@color-${c.index}: ${c.hex};`).join('\n')}`;
    
    case 'stylus':
      return `${colorVars.map(c => `$color-${c.index} = ${c.hex}`).join('\n')}`;
    
    default:
      return colors.map(c => c.hex).join('\n');
  }
}

export function CodeExport() {
  const { currentPalette } = useStore();
  const [selectedFormat, setSelectedFormat] = useState('css');
  const [copied, setCopied] = useState(false);

  if (!currentPalette) return null;

  const code = generateCode(currentPalette.colors, selectedFormat);
  const format = codeFormats.find(f => f.id === selectedFormat);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Code2 size={20} className="text-accent" />
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Export Code</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {codeFormats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              selectedFormat === format.id
                ? 'bg-accent text-white'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated'
            }`}
          >
            {format.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <pre className="p-4 rounded-xl bg-bg-tertiary text-sm text-text-secondary overflow-x-auto max-h-64 font-mono">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-lg bg-bg-elevated hover:bg-border transition-colors"
        >
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}