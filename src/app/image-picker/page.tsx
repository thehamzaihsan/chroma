'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, RefreshCw, Check } from 'lucide-react';
import { useStore } from '@/store';
import { DropZone } from '@/components/DropZone';
import { Button } from '@/components/Button';
import { extractColorsFromImage, generateId } from '@/lib/colors';

export default function ImagePickerPage() {
  const { currentPalette, setCurrentPalette, addToast } = useStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [colorCount, setColorCount] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExtract = useCallback(() => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractColorsFromImage(imageData, colorCount);
      
      setCurrentPalette({
        ...currentPalette!,
        id: generateId(),
        colors: colors.map(hex => ({ id: generateId(), hex })),
        lockedIndices: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setIsProcessing(false);
      addToast('Colors extracted successfully!', 'success');
    };
    
    img.src = imageUrl;
  }, [imageUrl, colorCount, currentPalette, setCurrentPalette, addToast]);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold font-heading">Image Picker</h1>
          <p className="text-sm text-text-muted">Extract colors from any image</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Upload Image</h2>
            <DropZone onFileSelect={handleFileSelect}>
              {imageUrl && (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded" 
                    className="w-full h-64 object-contain rounded-xl"
                  />
                </div>
              )}
            </DropZone>
            
            {imageUrl && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-text-muted mb-2 block">Number of colors</label>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={colorCount}
                    onChange={(e) => setColorCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>3</span>
                    <span>{colorCount}</span>
                    <span>10</span>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  onClick={handleExtract}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  Extract Colors
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Extracted Palette</h2>
            {currentPalette && (
              <div className="grid grid-cols-2 gap-3">
                {currentPalette.colors.map((color) => (
                  <div 
                    key={color.id}
                    className="h-24 rounded-xl flex items-end p-3"
                    style={{ backgroundColor: color.hex }}
                  >
                    <code className="text-xs font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                      {color.hex.toUpperCase()}
                    </code>
                  </div>
                ))}
              </div>
            )}
            
            {currentPalette && (
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <p className="text-sm text-text-muted mb-2">Copy all colors</p>
                <div className="flex flex-wrap gap-2">
                  {currentPalette.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex);
                        addToast(`Copied ${color.hex}`, 'success');
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary hover:bg-bg-elevated transition-colors"
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-border" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <code className="text-xs font-mono">{color.hex.toUpperCase()}</code>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </main>
    </div>
  );
}
