'use client';

import { useState } from 'react';
import type { ColorTheory } from '@/lib/types';

const theoryOptions: { value: ColorTheory; label: string; description: string }[] = [
  { value: 'random', label: 'Random', description: 'Completely random colors' },
  { value: 'monochromatic', label: 'Monochromatic', description: 'Single hue with varying saturation and lightness' },
  { value: 'analogous', label: 'Analogous', description: 'Adjacent colors on the color wheel' },
  { value: 'complementary', label: 'Complementary', description: 'Opposite colors for high contrast' },
  { value: 'split-complementary', label: 'Split Comp.', description: 'Base color plus two adjacent to complement' },
  { value: 'triadic', label: 'Triadic', description: 'Three equidistant colors on the wheel' },
  { value: 'tetradic', label: 'Tetradic', description: 'Four colors forming a rectangle' },
];

interface TheorySelectorProps {
  value: ColorTheory;
  onChange: (theory: ColorTheory) => void;
}

export function TheorySelector({ value, onChange }: TheorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = theoryOptions.find(t => t.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-bg-tertiary border border-border hover:border-border-light transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-medium">{selected?.label}</p>
          <p className="text-xs text-text-muted">{selected?.description}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-bg-secondary border border-border shadow-xl z-[110] animate-scale-in">
            {theoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors
                  ${option.value === value ? 'bg-accent/10' : ''}
                `}
              >
                <p className="text-sm font-medium text-text-primary">{option.label}</p>
                <p className="text-xs text-text-muted">{option.description}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ColorWheelPreview({ theory, baseColor }: { theory: ColorTheory; baseColor: string }) {
  const size = 120;
  const center = size / 2;
  const radius = size / 2 - 10;

  const getAngle = (hue: number) => (hue - 90) * (Math.PI / 180);
  const toCartesian = (angle: number, r: number) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  });

  let dots: { x: number; y: number; color: string }[] = [];
  const baseHue = parseInt(baseColor.slice(1, 3), 16) / 255 * 360;

  switch (theory) {
    case 'monochromatic':
      dots = [{ x: center, y: center - 30, color: baseColor }];
      break;
    case 'analogous':
      dots = [-30, -15, 0, 15, 30].map(offset => {
        const angle = getAngle(baseHue + offset);
        const pos = toCartesian(angle, radius * 0.7);
        return { ...pos, color: baseColor };
      });
      break;
    case 'complementary':
      dots = [
        toCartesian(getAngle(baseHue), radius * 0.5),
        toCartesian(getAngle(baseHue + 180), radius * 0.5),
      ].map(p => ({ ...p, color: baseColor }));
      break;
    case 'split-complementary':
      dots = [
        toCartesian(getAngle(baseHue), radius * 0.5),
        toCartesian(getAngle(baseHue + 150), radius * 0.5),
        toCartesian(getAngle(baseHue + 210), radius * 0.5),
      ].map(p => ({ ...p, color: baseColor }));
      break;
    case 'triadic':
      dots = [0, 120, 240].map(offset => {
        const pos = toCartesian(getAngle(baseHue + offset), radius * 0.5);
        return { ...pos, color: baseColor };
      });
      break;
    case 'tetradic':
      dots = [0, 90, 180, 270].map(offset => {
        const pos = toCartesian(getAngle(baseHue + offset), radius * 0.5);
        return { ...pos, color: baseColor };
      });
      break;
    default:
      dots = Array.from({ length: 5 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius * 0.8;
        return { ...toCartesian(angle, r), color: baseColor };
      });
  }

  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 70%, 50%)" />
          <stop offset="16.67%" stopColor="hsl(60, 70%, 50%)" />
          <stop offset="33.33%" stopColor="hsl(120, 70%, 50%)" />
          <stop offset="50%" stopColor="hsl(180, 70%, 50%)" />
          <stop offset="66.67%" stopColor="hsl(240, 70%, 50%)" />
          <stop offset="83.33%" stopColor="hsl(300, 70%, 50%)" />
          <stop offset="100%" stopColor="hsl(360, 70%, 50%)" />
        </linearGradient>
      </defs>
      
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="url(#rainbow)"
        strokeWidth={6}
        opacity={0.3}
      />
      
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={8}
          fill={dot.color}
          stroke="#0D0D0F"
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}
