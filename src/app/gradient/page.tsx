'use client';

import { useState, useCallback } from 'react';
import { Copy, Plus, Minus, Download } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/Button';
import { gradientToCss, generateId } from '@/lib/colors';
import { HexColorPicker } from 'react-colorful';
import type { GradientType } from '@/lib/types';

export default function GradientPage() {
  const { gradient, setGradientType, setGradientAngle, addGradientStop, updateGradientStop, removeGradientStop, addToast } = useStore();
  const [editingStop, setEditingStop] = useState<string | null>(null);

  const handleCopy = () => {
    const css = gradientToCss(gradient);
    navigator.clipboard.writeText(`background: ${css};`);
    addToast('CSS copied!', 'success');
  };

  const handleExport = () => {
    const css = gradientToCss(gradient);
    const fullCSS = `.gradient {\n  background: ${css};\n}`;
    
    const blob = new Blob([fullCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Gradient exported!', 'success');
  };

  const gradientCss = gradientToCss(gradient);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading">Gradient Maker</h1>
            <p className="text-sm text-text-muted">Create smooth CSS gradients</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCopy}>
              <Copy size={18} />
              Copy CSS
            </Button>
            <Button variant="primary" onClick={handleExport}>
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div 
          className="w-full h-64 rounded-2xl shadow-lg transition-all duration-300"
          style={{ background: gradientCss }}
        />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Gradient Type</h3>
              <div className="flex gap-2">
                {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`
                      flex-1 py-3 px-4 rounded-xl capitalize transition-all
                      ${gradient.type === type 
                        ? 'bg-accent text-white' 
                        : 'bg-bg-tertiary hover:bg-bg-elevated'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">
                {gradient.type === 'linear' ? 'Angle' : 'Rotation'}
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={gradient.angle}
                  onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 text-center font-mono">{gradient.angle}°</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Color Stops</h3>
                {gradient.stops.length < 8 && (
                  <Button variant="ghost" size="sm" onClick={addGradientStop}>
                    <Plus size={16} />
                    Add Stop
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {gradient.stops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg cursor-pointer border border-border"
                      style={{ backgroundColor: stop.color }}
                      onClick={() => setEditingStop(stop.id)}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) => updateGradientStop(stop.id, { position: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-mono text-sm">{stop.position}%</span>
                    {gradient.stops.length > 2 && (
                      <button
                        onClick={() => removeGradientStop(stop.id)}
                        className="p-1 hover:bg-bg-tertiary rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">CSS Output</h3>
              <pre className="p-4 rounded-xl bg-bg-tertiary border border-border overflow-x-auto">
                <code className="text-sm font-mono text-text-secondary">
                  {`background: ${gradientCss};`}
                </code>
              </pre>
            </div>

            {editingStop && (
              <div className="space-y-4 p-4 rounded-xl bg-bg-secondary border border-border">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Edit Color</h3>
                <HexColorPicker
                  color={gradient.stops.find(s => s.id === editingStop)?.color || '#ffffff'}
                  onChange={(color) => updateGradientStop(editingStop, { color })}
                  style={{ width: '100%' }}
                />
                <input
                  type="text"
                  value={gradient.stops.find(s => s.id === editingStop)?.color || ''}
                  onChange={(e) => updateGradientStop(editingStop, { color: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-tertiary border border-border font-mono text-sm"
                />
                <Button variant="ghost" size="sm" onClick={() => setEditingStop(null)}>
                  Done
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Gradient Preview</h3>
              <div className="relative h-32 rounded-xl overflow-hidden">
                <div 
                  className="absolute inset-0"
                  style={{ background: gradientCss }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
                    <span className="text-white font-medium">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
