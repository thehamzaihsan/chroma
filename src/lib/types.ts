export interface Color {
  id: string;
  hex: string;
  name?: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
  lockedIndices: number[];
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  paletteIds: string[];
  createdAt: string;
}

export type ColorTheory = 
  | 'random'
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic';

export interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export interface Gradient {
  type: GradientType;
  angle: number;
  stops: GradientStop[];
}

export interface Settings {
  colorTheory: ColorTheory;
  baseColor: string;
  exportFormats: string[];
  showNames: boolean;
  font?: string;
  fontUrl?: string;
  theme?: 'light' | 'dark';
}

export type ExportFormat = 'css' | 'scss' | 'json' | 'png' | 'svg' | 'pdf' | 'swift' | 'kotlin' | 'java';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
