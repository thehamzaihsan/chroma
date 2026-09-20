'use client';

import { useStore } from '@/store';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export function Toasts() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary border-l-4 shadow-lg
            animate-slide-up min-w-[280px]
            ${toast.type === 'success' ? 'border-success' : ''}
            ${toast.type === 'error' ? 'border-error' : ''}
            ${toast.type === 'info' ? 'border-accent' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle size={20} className="text-success" />}
          {toast.type === 'error' && <XCircle size={20} className="text-error" />}
          {toast.type === 'info' && <Info size={20} className="text-accent" />}
          
          <span className="flex-1 text-sm">{toast.message}</span>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-bg-tertiary rounded transition-colors"
          >
            <XCircle size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

import { X as XCircleIcon } from 'lucide-react';
import { X as XIcon } from 'lucide-react';
