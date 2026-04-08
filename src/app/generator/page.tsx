'use client';

import { useEffect, useCallback, useState } from 'react';
import { Sparkles, Shuffle, Save, Plus, Minus, Download, Share2 } from 'lucide-react';
import { useStore } from '@/store';
import { ColorSwatch } from '@/components/ColorSwatch';
import { Button } from '@/components/Button';
import { TheorySelector, ColorWheelPreview } from '@/components/TheorySelector';
import { saveAs } from 'file-saver';

export default function GeneratorPage() {
  const { 
    currentPalette, 
    settings,
    generatePalette, 
    lockColor, 
    unlockColor, 
    updateColor,
    addColor,
    removeColor,
    setColorTheory,
    savePalette,
    addToast,
  } = useStore();

  const [showTheory, setShowTheory] = useState(false);

  const handleGenerate = useCallback(() => {
    generatePalette();
  }, [generatePalette]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  const handleSave = () => {
    savePalette();
    addToast('Palette saved successfully!', 'success');
  };

  const handleExport = () => {
    if (!currentPalette) return;
    
    const css = `:root {\n${currentPalette.colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    
    const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
    saveAs(blob, 'palette.css');
    addToast('CSS exported!', 'success');
  };

  const handleShare = async () => {
    if (!currentPalette) return;
    
    const colors = currentPalette.colors.map(c => c.hex).join(',');
    const url = `${window.location.origin}?palette=${encodeURIComponent(colors)}`;
    
    await navigator.clipboard.writeText(url);
    addToast('Share link copied to clipboard!', 'success');
  };

  if (!currentPalette) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading">Palette Generator</h1>
            <p className="text-sm text-text-muted">Press <kbd className="px-2 py-0.5 rounded bg-bg-tertiary text-xs font-mono">Space</kbd> to generate</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleShare}>
              <Share2 size={18} />
              Share
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={18} />
              Export
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={18} />
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleGenerate}
            className="gap-2"
          >
            <Sparkles size={20} />
            Generate
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => setShowTheory(!showTheory)}
          >
            <Shuffle size={18} />
            Color Theory
          </Button>
        </div>

        {showTheory && (
          <div className="p-6 rounded-2xl bg-bg-secondary border border-border animate-slide-up">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">Harmony Rule</h3>
                <TheorySelector value={settings.colorTheory} onChange={setColorTheory} />
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Preview</h3>
                <ColorWheelPreview theory={settings.colorTheory} baseColor={settings.baseColor} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Your Palette</h2>
          <div className="flex items-center gap-2">
            {currentPalette.colors.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => removeColor(currentPalette.colors.length - 1)}>
                <Minus size={16} />
                Remove
              </Button>
            )}
            {currentPalette.colors.length < 10 && (
              <Button variant="ghost" size="sm" onClick={() => addColor('#888888')}>
                <Plus size={16} />
                Add Color
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-visible pb-4">
          {currentPalette.colors.map((color, index) => (
            <ColorSwatch
              key={color.id}
              color={color.hex}
              index={index}
              isLocked={currentPalette.lockedIndices.includes(index)}
              onLock={() => 
                currentPalette.lockedIndices.includes(index) 
                  ? unlockColor(index) 
                  : lockColor(index)
              }
              onUpdate={(hex) => updateColor(index, hex)}
              showName={settings.showNames}
            />
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-bg-secondary border border-border">
          <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(currentPalette.colors.map(c => c.hex).join('\n'));
                addToast('All colors copied!', 'success');
              }}
              className="p-4 rounded-xl bg-bg-tertiary hover:bg-bg-elevated transition-colors text-left"
            >
              <p className="font-medium">Copy All HEX</p>
              <p className="text-xs text-text-muted">Copy all colors to clipboard</p>
            </button>
            
            <button 
              onClick={handleExport}
              className="p-4 rounded-xl bg-bg-tertiary hover:bg-bg-elevated transition-colors text-left"
            >
              <p className="font-medium">Export CSS</p>
              <p className="text-xs text-text-muted">Download as CSS variables</p>
            </button>
            
            <button 
              onClick={handleShare}
              className="p-4 rounded-xl bg-bg-tertiary hover:bg-bg-elevated transition-colors text-left"
            >
              <p className="font-medium">Share Link</p>
              <p className="text-xs text-text-muted">Copy shareable URL</p>
            </button>
            
            <button 
              onClick={() => savePalette()}
              className="p-4 rounded-xl bg-bg-tertiary hover:bg-bg-elevated transition-colors text-left"
            >
              <p className="font-medium">Save Palette</p>
              <p className="text-xs text-text-muted">Save to your collection</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
