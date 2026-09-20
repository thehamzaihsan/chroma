import { colord, extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import namesPlugin from 'colord/plugins/names';
import mix from 'colord/plugins/mix';
import type { ColorTheory, Color, Gradient } from './types';

extend([harmoniesPlugin, namesPlugin, mix]);

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = colord(hex).toRgb();
  return { r: result.r, g: result.g, b: result.b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return colord({ r, g, b }).toHex();
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = colord(hex).toHsl();
  return { h: result.h, s: result.s, l: result.l };
}

export function hslToHex(h: number, s: number, l: number): string {
  return colord({ h, s, l }).toHex();
}

export function getColorName(hex: string): string {
  const name = colord(hex).toName({ closest: true });
  return name || '';
}

export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

export function generatePaletteByTheory(theory: ColorTheory, baseColor?: string): string[] {
  const base = baseColor || generateRandomColor();
  const baseHsl = colord(base).toHsl();
  
  switch (theory) {
    case 'monochromatic': {
      const colors: string[] = [];
      for (let i = 0; i < 5; i++) {
        const l = 20 + (i * 15);
        colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(l, 90)));
      }
      return colors;
    }
    case 'analogous': {
      const colors: string[] = [];
      for (let i = -2; i <= 2; i++) {
        const h = (baseHsl.h + i * 30 + 360) % 360;
        colors.push(hslToHex(h, baseHsl.s, baseHsl.l));
      }
      return colors;
    }
    case 'complementary': {
      const colors: string[] = [base];
      colors.push(hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l));
      for (let i = 0; i < 3; i++) {
        colors.push(hslToHex(baseHsl.h, baseHsl.s * (0.3 + i * 0.2), 50 + i * 10));
      }
      return colors.slice(0, 5);
    }
    case 'split-complementary': {
      return [
        base,
        hslToHex((baseHsl.h + 150) % 360, baseHsl.s, baseHsl.l),
        hslToHex((baseHsl.h + 210) % 360, baseHsl.s, baseHsl.l),
        hslToHex(baseHsl.h, baseHsl.s * 0.6, 70),
        hslToHex(baseHsl.h, baseHsl.s * 0.3, 40),
      ];
    }
    case 'triadic': {
      return [
        base,
        hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l),
        hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l),
        hslToHex(baseHsl.h, baseHsl.s * 0.5, 75),
        hslToHex(baseHsl.h, baseHsl.s * 0.5, 35),
      ];
    }
    case 'tetradic': {
      return [
        base,
        hslToHex((baseHsl.h + 90) % 360, baseHsl.s, baseHsl.l),
        hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l),
        hslToHex((baseHsl.h + 270) % 360, baseHsl.s, baseHsl.l),
        hslToHex(baseHsl.h, baseHsl.s * 0.4, 60),
      ];
    }
    default: {
      return Array.from({ length: 5 }, () => generateRandomColor());
    }
  }
}

function getLuminance(hex: string): number {
  const rgb = colord(hex).toRgb();
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG(contrast: number, level: 'AA' | 'AAA', isLargeText: boolean): boolean {
  if (isLargeText) {
    return level === 'AA' ? contrast >= 3 : contrast >= 4.5;
  }
  return level === 'AA' ? contrast >= 4.5 : contrast >= 7;
}

export function lighten(color: string, amount: number): string {
  return colord(color).lighten(amount).toHex();
}

export function darken(color: string, amount: number): string {
  return colord(color).darken(amount).toHex();
}

export function saturate(color: string, amount: number): string {
  return colord(color).saturate(amount).toHex();
}

export function getShades(color: string, count: number = 9): string[] {
  const hsl = colord(color).toHsl();
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    shades.push(hslToHex(hsl.h, hsl.s, 10 + i * 10));
  }
  return shades;
}

export function getColorFormats(hex: string) {
  const rgb = colord(hex).toRgb();
  const hsl = colord(hex).toHsl();
  
  return {
    hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`,
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
    hsla: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a ?? 1})`,
    cmyk: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) to CMYK requires conversion`,
    lab: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) to LAB requires conversion`,
    name: getColorName(hex),
  };
}

export function simulateColorBlindness(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): string {
  const rgb = colord(hex).toRgb();
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  const matrices: Record<string, number[][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  };

  const matrix = matrices[type];
  const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

  return colord({ r: newR * 255, g: newG * 255, b: newB * 255 }).toHex();
}

export function extractColorsFromImage(imageData: ImageData, count: number = 5): string[] {
  const pixels: number[][] = [];
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    
    if (a > 128) {
      pixels.push([r, g, b]);
    }
  }

  if (pixels.length === 0) {
    return Array.from({ length: count }, () => generateRandomColor());
  }

  const sampleSize = Math.min(pixels.length, 10000);
  const step = Math.floor(pixels.length / sampleSize);
  const samples: number[][] = [];
  
  for (let i = 0; i < sampleSize; i++) {
    samples.push(pixels[i * step]);
  }

  const clusters = kMeans(samples, count);
  
  return clusters.map(cluster => 
    rgbToHex(Math.round(cluster[0]), Math.round(cluster[1]), Math.round(cluster[2]))
  );
}

function kMeans(pixels: number[][], k: number, maxIterations: number = 20): number[][] {
  let centroids: number[][] = [];
  
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: number[][][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = euclideanDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      clusters[closestIdx].push(pixel);
    }

    const newCentroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        const mean = clusters[i].reduce(
          (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
          [0, 0, 0]
        );
        newCentroids.push([
          mean[0] / clusters[i].length,
          mean[1] / clusters[i].length,
          mean[2] / clusters[i].length,
        ]);
      } else {
        newCentroids.push(centroids[i]);
      }
    }

    centroids = newCentroids;
  }

  return centroids;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}

export function gradientToCss(gradient: Gradient): string {
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (gradient.type) {
    case 'linear':
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    case 'radial':
      return `radial-gradient(circle, ${stops})`;
    case 'conic':
      return `conic-gradient(from ${gradient.angle}deg, ${stops})`;
    default:
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
  }
}

export function generateGradientPalette(gradient: Gradient): Color[] {
  return gradient.stops.map(stop => ({
    id: stop.id,
    hex: stop.color,
    name: getColorName(stop.color),
  }));
}
