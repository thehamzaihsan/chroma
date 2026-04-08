'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  children?: React.ReactNode;
}

export function DropZone({ onFileSelect, accept = 'image/*', children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200
        ${isDragging 
          ? 'border-accent bg-accent/10 scale-[1.02]' 
          : 'border-border hover:border-border-light'
        }
      `}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {children || (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-bg-tertiary">
            {isDragging ? (
              <Upload size={32} className="text-accent" />
            ) : (
              <ImageIcon size={32} className="text-text-muted" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-text-primary">
              {isDragging ? 'Drop your image here' : 'Drag & drop an image'}
            </p>
            <p className="text-sm text-text-muted mt-1">
              or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
