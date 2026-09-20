import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Color, Palette, Project, Settings, ColorTheory, Gradient, GradientType, GradientStop, Toast } from '@/lib/types';
import { generatePaletteByTheory, generateId } from '@/lib/colors';

interface AppState {
  palettes: Palette[];
  projects: Project[];
  currentPalette: Palette | null;
  settings: Settings;
  gradient: Gradient;
  toasts: Toast[];
  
  generatePalette: (lockedColors?: Color[]) => void;
  setCurrentPalette: (palette: Palette) => void;
  lockColor: (index: number) => void;
  unlockColor: (index: number) => void;
  updateColor: (index: number, hex: string) => void;
  addColor: (hex: string) => void;
  removeColor: (index: number) => void;
  reorderColors: (startIndex: number, endIndex: number) => void;
  
  setColorTheory: (theory: ColorTheory) => void;
  setBaseColor: (hex: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  
  createProject: (name: string, description?: string) => Project;
  deleteProject: (id: string) => void;
  addPaletteToProject: (projectId: string, paletteId: string) => void;
  removePaletteFromProject: (projectId: string, paletteId: string) => void;
  
  savePalette: (name?: string) => void;
  deletePalette: (id: string) => void;
  duplicatePalette: (id: string) => void;
  
  setGradientType: (type: GradientType) => void;
  setGradientAngle: (angle: number) => void;
  addGradientStop: () => void;
  updateGradientStop: (id: string, updates: Partial<GradientStop>) => void;
  removeGradientStop: (id: string) => void;
  
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const defaultGradient: Gradient = {
  type: 'linear',
  angle: 90,
  stops: [
    { id: generateId(), color: '#6366F1', position: 0 },
    { id: generateId(), color: '#EC4899', position: 100 },
  ],
};

const defaultSettings: Settings = {
  colorTheory: 'random',
  baseColor: '#6366F1',
  exportFormats: ['css', 'json'],
  showNames: true,
  theme: 'light',
};

function createInitialPalette(): Palette {
  const colors = generatePaletteByTheory('random');
  return {
    id: uuidv4(),
    name: 'Untitled Palette',
    colors: colors.map(hex => ({ id: generateId(), hex, name: '' })),
    lockedIndices: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      palettes: [],
      projects: [],
      currentPalette: createInitialPalette(),
      settings: defaultSettings,
      gradient: defaultGradient,
      toasts: [],

      generatePalette: (lockedColors?: Color[]) => {
        const { currentPalette, settings } = get();
        if (!currentPalette) return;

        const newColors = generatePaletteByTheory(settings.colorTheory, settings.baseColor);
        
        const updatedColors = currentPalette.colors.map((color, index) => {
          if (currentPalette.lockedIndices.includes(index) && lockedColors?.[index]) {
            return lockedColors[index];
          }
          if (currentPalette.lockedIndices.includes(index)) {
            return color;
          }
          return { id: generateId(), hex: newColors[index] || newColors[0], name: '' };
        });

        set({
          currentPalette: {
            ...currentPalette,
            colors: updatedColors,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setCurrentPalette: (palette) => {
        set({ currentPalette: palette });
      },

      lockColor: (index) => {
        const { currentPalette } = get();
        if (!currentPalette) return;

        const lockedIndices = currentPalette.lockedIndices.includes(index)
          ? currentPalette.lockedIndices
          : [...currentPalette.lockedIndices, index];

        set({
          currentPalette: {
            ...currentPalette,
            lockedIndices,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      unlockColor: (index) => {
        const { currentPalette } = get();
        if (!currentPalette) return;

        set({
          currentPalette: {
            ...currentPalette,
            lockedIndices: currentPalette.lockedIndices.filter(i => i !== index),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      updateColor: (index, hex) => {
        const { currentPalette } = get();
        if (!currentPalette) return;

        const colors = [...currentPalette.colors];
        colors[index] = { ...colors[index], hex };

        set({
          currentPalette: {
            ...currentPalette,
            colors,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      addColor: (hex) => {
        const { currentPalette } = get();
        if (!currentPalette || currentPalette.colors.length >= 10) return;

        set({
          currentPalette: {
            ...currentPalette,
            colors: [...currentPalette.colors, { id: generateId(), hex, name: '' }],
            updatedAt: new Date().toISOString(),
          },
        });
      },

      removeColor: (index) => {
        const { currentPalette } = get();
        if (!currentPalette || currentPalette.colors.length <= 2) return;

        const colors = currentPalette.colors.filter((_, i) => i !== index);
        const lockedIndices = currentPalette.lockedIndices
          .filter(i => i !== index)
          .map(i => (i > index ? i - 1 : i));

        set({
          currentPalette: {
            ...currentPalette,
            colors,
            lockedIndices,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      reorderColors: (startIndex, endIndex) => {
        const { currentPalette } = get();
        if (!currentPalette) return;

        const colors = [...currentPalette.colors];
        const [removed] = colors.splice(startIndex, 1);
        colors.splice(endIndex, 0, removed);

        const lockedIndices = currentPalette.lockedIndices.map(i => {
          if (i === startIndex) return endIndex;
          if (startIndex < endIndex && i > startIndex && i <= endIndex) return i - 1;
          if (startIndex > endIndex && i >= endIndex && i < startIndex) return i + 1;
          return i;
        });

        set({
          currentPalette: {
            ...currentPalette,
            colors,
            lockedIndices,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setColorTheory: (theory) => {
        const { settings } = get();
        set({ settings: { ...settings, colorTheory: theory } });
      },

      setBaseColor: (hex) => {
        const { settings } = get();
        set({ settings: { ...settings, baseColor: hex } });
      },

      updateSettings: (newSettings) => {
        const { settings } = get();
        set({ settings: { ...settings, ...newSettings } });
      },

      createProject: (name, description) => {
        const project: Project = {
          id: uuidv4(),
          name,
          description,
          paletteIds: [],
          createdAt: new Date().toISOString(),
        };

        set({ projects: [...get().projects, project] });
        return project;
      },

      deleteProject: (id) => {
        set({ projects: get().projects.filter(p => p.id !== id) });
      },

      addPaletteToProject: (projectId, paletteId) => {
        const { projects } = get();
        set({
          projects: projects.map(p =>
            p.id === projectId
              ? { ...p, paletteIds: [...p.paletteIds, paletteId] }
              : p
          ),
        });
      },

      removePaletteFromProject: (projectId, paletteId) => {
        const { projects } = get();
        set({
          projects: projects.map(p =>
            p.id === projectId
              ? { ...p, paletteIds: p.paletteIds.filter(id => id !== paletteId) }
              : p
          ),
        });
      },

      savePalette: (name) => {
        const { currentPalette, palettes } = get();
        if (!currentPalette) return;

        const paletteToSave = {
          ...currentPalette,
          name: name || currentPalette.name,
          updatedAt: new Date().toISOString(),
        };

        const existingIndex = palettes.findIndex(p => p.id === currentPalette.id);
        
        if (existingIndex >= 0) {
          const updatedPalettes = [...palettes];
          updatedPalettes[existingIndex] = paletteToSave;
          set({ palettes: updatedPalettes });
        } else {
          set({ palettes: [...palettes, paletteToSave] });
        }
        
        set({ currentPalette: paletteToSave });
      },

      deletePalette: (id) => {
        set({ palettes: get().palettes.filter(p => p.id !== id) });
      },

      duplicatePalette: (id) => {
        const { palettes } = get();
        const palette = palettes.find(p => p.id === id);
        if (!palette) return;

        const newPalette: Palette = {
          ...palette,
          id: uuidv4(),
          name: `${palette.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ palettes: [...palettes, newPalette] });
      },

      setGradientType: (type) => {
        const { gradient } = get();
        set({ gradient: { ...gradient, type } });
      },

      setGradientAngle: (angle) => {
        const { gradient } = get();
        set({ gradient: { ...gradient, angle } });
      },

      addGradientStop: () => {
        const { gradient } = get();
        if (gradient.stops.length >= 8) return;

        const newStop: GradientStop = {
          id: generateId(),
          color: '#FFFFFF',
          position: 50,
        };

        const stops = [...gradient.stops, newStop].sort((a, b) => a.position - b.position);
        set({ gradient: { ...gradient, stops } });
      },

      updateGradientStop: (id, updates) => {
        const { gradient } = get();
        const stops = gradient.stops.map(stop =>
          stop.id === id ? { ...stop, ...updates } : stop
        );
        set({ gradient: { ...gradient, stops } });
      },

      removeGradientStop: (id) => {
        const { gradient } = get();
        if (gradient.stops.length <= 2) return;

        set({
          gradient: {
            ...gradient,
            stops: gradient.stops.filter(stop => stop.id !== id),
          },
        });
      },

      addToast: (message, type) => {
        const toast: Toast = { id: generateId(), message, type };
        set({ toasts: [...get().toasts, toast] });
        
        setTimeout(() => {
          get().removeToast(toast.id);
        }, 3000);
      },

      removeToast: (id) => {
        set({ toasts: get().toasts.filter(t => t.id !== id) });
      },
    }),
    {
      name: 'chromastudio-storage',
      partialize: (state) => ({
        palettes: state.palettes,
        projects: state.projects,
        settings: state.settings,
      }),
    }
  )
);
