'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/Button';
import { simulateColorBlindness } from '@/lib/colors';

type BlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const blindnessInfo: Record<BlindnessType, { name: string; description: string; prevalence: string }> = {
  protanopia: { 
    name: 'Protanopia', 
    description: 'Red-blind (no red cones)',
    prevalence: '~1% of males'
  },
  deuteranopia: { 
    name: 'Deuteranopia', 
    description: 'Green-blind (no green cones)',
    prevalence: '~1% of males'
  },
  tritanopia: { 
    name: 'Tritanopia', 
    description: 'Blue-blind (no blue cones)',
    prevalence: '~0.01% of population'
  },
  achromatopsia: { 
    name: 'Achromatopsia', 
    description: 'Complete color blindness',
    prevalence: '~0.003% of population'
  },
};

export default function ColorBlindPage() {
  const { currentPalette, addToast } = useStore();
  const [selectedType, setSelectedType] = useState<BlindnessType>('deuteranopia');
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');

  const types: BlindnessType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold font-heading">Color Blindness Simulator</h1>
          <p className="text-sm text-text-muted">View your palette through different types of color vision deficiency</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </Button>
            <Button 
              variant={viewMode === 'compare' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('compare')}
            >
              Compare View
            </Button>
          </div>
        </div>

        {currentPalette && (
          <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
            <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">Original Palette</h3>
            <div className="flex gap-3">
              {currentPalette.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1 h-20 rounded-xl flex items-end p-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <code className="text-xs font-mono bg-black/30 px-2 py-1 rounded">
                    {color.hex.toUpperCase()}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {types.map((type) => (
              <div key={type} className="p-6 rounded-2xl bg-bg-secondary border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{blindnessInfo[type].name}</h3>
                    <p className="text-xs text-text-muted">{blindnessInfo[type].description}</p>
                  </div>
                  <span className="text-xs text-text-muted px-2 py-1 rounded bg-bg-tertiary">
                    {blindnessInfo[type].prevalence}
                  </span>
                </div>
                
                {currentPalette && (
                  <div className="flex gap-2">
                    {currentPalette.colors.map((color) => {
                      const simulated = simulateColorBlindness(color.hex, type);
                      return (
                        <div
                          key={color.id}
                          className="flex-1 h-16 rounded-lg flex items-end p-1.5"
                          style={{ backgroundColor: simulated }}
                        >
                          <code className="text-[10px] font-mono bg-black/30 px-1 py-0.5 rounded">
                            {simulated.toUpperCase()}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">{blindnessInfo[selectedType].name}</h3>
                  <p className="text-xs text-text-muted">{blindnessInfo[selectedType].description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-colors ${
                      type === selectedType 
                        ? 'bg-accent/20 border border-accent' 
                        : 'bg-bg-tertiary hover:bg-bg-elevated border border-transparent'
                    }`}
                  >
                    <div className="flex gap-1">
                      {currentPalette?.colors.map((color) => (
                        <div
                          key={color.id}
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: simulateColorBlindness(color.hex, type) }}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{blindnessInfo[type].name}</p>
                      <p className="text-xs text-text-muted">{blindnessInfo[type].prevalence}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                Simulated View ({blindnessInfo[selectedType].name})
              </h3>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {currentPalette?.colors.map((color) => (
                  <div key={color.id} className="text-center">
                    <div
                      className="w-full aspect-square rounded-xl mb-2"
                      style={{ backgroundColor: simulateColorBlindness(color.hex, selectedType) }}
                    />
                    <p className="text-xs font-mono">{simulateColorBlindness(color.hex, selectedType).toUpperCase()}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-bg-tertiary space-y-2">
                <p className="text-sm" style={{ color: simulateColorBlindness('#FFFFFF', selectedType) }}>
                  White text on simulated view
                </p>
                <p className="text-sm" style={{ color: simulateColorBlindness('#000000', selectedType) }}>
                  Black text on simulated view
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-warning/10 border border-warning/30">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-warning">Accessibility Tip</h3>
              <p className="text-sm text-text-secondary mt-1">
                When designing for accessibility, avoid relying solely on color to convey information. 
                Use patterns, icons, or text labels alongside colors to ensure all users can understand your content.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
