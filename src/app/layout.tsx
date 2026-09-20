'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Palette, 
  Contrast,
  Eye,
  Inspect,
  Search,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Palette as PaletteIcon,
  Moon,
  Sun
} from 'lucide-react';
import { Toasts } from '@/components/Toasts';
import { useStore } from '@/store';

const aeonik = localFont({
  src: '../../public/AeonikTRIAL-Regular.otf',
  variable: '--font-aeonik',
  display: 'swap',
});

const navItems = [
  { href: '/generator', label: 'Generator', icon: Sparkles },
  { href: '/image-picker', label: 'Image Picker', icon: ImageIcon },
  { href: '/gradient', label: 'Gradient Maker', icon: Palette },
  { href: '/contrast', label: 'Contrast Checker', icon: Contrast },
  { href: '/inspector', label: 'Color Inspector', icon: Inspect },
  { href: '/colorblind', label: 'Color Blindness', icon: Eye },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
];

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { settings, updateSettings } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && settings.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme, mounted]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const showSidebar = pathname !== '/';

  return (
    <html lang="en" className={aeonik.variable}>
      <body className={aeonik.className}>
        <div className="min-h-screen flex">
          {showSidebar && (
          <aside 
            className={`
              fixed left-0 top-0 h-screen bg-bg-secondary border-r border-border
              transition-all duration-300 z-40 flex flex-col
              ${collapsed ? 'w-16' : 'w-60'}
            `}
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Image 
                src="/favicon.svg" 
                alt="ChromaStudio" 
                width={40} 
                height={40}
                className="w-10 h-10 rounded-xl"
              />
              {!collapsed && (
                <div className="animate-fade-in">
                  <h1 className="font-bold text-lg">ChromaStudio</h1>
                  <p className="text-xs text-text-muted">Color Toolkit</p>
                </div>
              )}
            </div>

            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-accent/20 text-accent' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium animate-fade-in">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border flex flex-col gap-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {!collapsed && <span className="text-sm">{settings.theme === 'dark' ? 'Light' : 'Dark'}</span>}
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                {!collapsed && <span className="text-sm">Collapse</span>}
              </button>
            </div>
          </aside>
          )}

          <main className={`flex-1 transition-all duration-300 ${showSidebar ? (collapsed ? 'ml-16' : 'ml-60') : ''}`}>
            {children}
          </main>

          <Toasts />
        </div>
      </body>
    </html>
  );
}
