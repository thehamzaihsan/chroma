'use client';

import { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import { useStore } from '@/store';

interface ColorSwatchProps {
  color: string;
  index: number;
  isLocked: boolean;
  onLock: () => void;
  onUpdate: (hex: string) => void;
  showName?: boolean;
}

export function ColorSwatch({ color, index, isLocked, onLock, onUpdate, showName }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { settings } = useStore();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const textColor = isLightColor(color) ? '#000000' : '#FFFFFF';

  return (
    <div
      className="relative group flex-1 min-w-[120px] h-64 md:h-80 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:z-10"
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(!isEditing)}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
            style={{ color: textColor }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="space-y-2">
          {isEditing && (
            <input
              type="color"
              value={color}
              onChange={(e) => onUpdate(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-12 rounded-lg cursor-pointer border-0"
            />
          )}
          
          <div className="flex items-center justify-between">
            <code 
              className="font-mono text-sm font-medium px-2 py-1 rounded bg-black/20 backdrop-blur-sm"
              style={{ color: textColor }}
            >
              {color.toUpperCase()}
            </code>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onLock();
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLocked 
                  ? 'bg-white/30 scale-110' 
                  : 'bg-black/20 hover:bg-black/40'
              } ${isLocked ? '[&:active]:scale-95' : ''}`}
              style={{ color: textColor }}
            >
              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
          </div>

          {showName && (
            <p 
              className="text-sm font-medium px-2 py-1 rounded bg-black/20 backdrop-blur-sm w-fit"
              style={{ color: textColor }}
            >
              {getColorName(color)}
            </p>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="absolute top-3 left-3">
          <Lock size={16} style={{ color: textColor, opacity: 0.7 }} />
        </div>
      )}
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

function getColorName(hex: string): string {
  const names: Record<string, string> = {
    '#FF0000': 'Red',
    '#FF4500': 'Orange Red',
    '#FFA500': 'Orange',
    '#FFD700': 'Gold',
    '#FFFF00': 'Yellow',
    '#9ACD32': 'Yellow Green',
    '#32CD32': 'Lime Green',
    '#00FF00': 'Lime',
    '#00FA9A': 'Medium Spring Green',
    '#00CED1': 'Dark Turquoise',
    '#00BFFF': 'Deep Sky Blue',
    '#1E90FF': 'Dodger Blue',
    '#0000FF': 'Blue',
    '#8A2BE2': 'Blue Violet',
    '#9932CC': 'Dark Orchid',
    '#FF00FF': 'Magenta',
    '#FF1493': 'Deep Pink',
    '#FF69B4': 'Hot Pink',
    '#FFC0CB': 'Pink',
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#808080': 'Gray',
    '#A9A9A9': 'Dark Gray',
    '#D3D3D3': 'Light Gray',
    '#F5F5DC': 'Beige',
    '#DEB887': 'Burlywood',
    '#8B4513': 'Saddle Brown',
    '#A52A2A': 'Brown',
    '#F0E68C': 'Khaki',
  };
  return names[hex.toUpperCase()] || 'Custom';
}
