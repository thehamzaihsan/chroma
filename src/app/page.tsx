'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  Contrast,
  Eye,
  PaintBucket,
  Inspect,
  FolderOpen,
  ArrowRight,
  Moon,
  Sun,
  Zap,
  Layout
} from 'lucide-react';
import { useStore } from '@/store';
import { useEffect, useState } from 'react';

const colors = ['#F472B6', '#A78BFA', '#6366F1', '#22D3EE', '#34D399', '#FBBF24', '#FB923C', '#F87171'];

const features = [
  { icon: Sparkles, title: 'Smart Generation', description: 'Generate palettes using color theory rules like complementary, analogous, and triadic' },
  { icon: Palette, title: 'Multi-Format Export', description: 'Export to CSS, Tailwind, SCSS, JSON, React, Flutter, Swift, and 12+ formats' },
  { icon: ImageIcon, title: 'Extract from Images', description: 'Pick colors from any image with AI-powered extraction' },
  { icon:   PaintBucket, title: 'Gradient Creator', description: 'Build linear, radial, and conic gradients with preview' },
  { icon: Contrast, title: 'Accessibility', description: 'Check contrast ratios and WCAG compliance instantly' },
  { icon: Eye, title: 'Vision Simulation', description: 'Preview palettes through color blindness filters' },
];

const tools = [
  { href: '/generator', icon: Sparkles, label: 'Generator', desc: 'AI-powered palette creation' },
  { href: '/image-picker', icon: ImageIcon, label: 'Image Picker', desc: 'Extract from photos' },
  { href: '/gradient', icon:   PaintBucket, label: 'Gradients', desc: 'Create gradient flows' },
  { href: '/contrast', icon: Contrast, label: 'Contrast', desc: 'Check accessibility' },
  { href: '/inspector', icon: Inspect, label: 'Inspector', desc: 'Deep color analysis' },
  { href: '/colorblind', icon: Eye, label: 'Color Blind', desc: 'Vision simulation' },
  { href: '/explore', icon: Search, label: 'Explore', desc: 'Trending palettes' },
  { href: '/projects', icon: FolderOpen, label: 'Projects', desc: 'Save & organize' },
];

import { Search } from 'lucide-react';

export default function LandingPage() {
  const { settings, updateSettings } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  useEffect(() => {
    if (mounted && settings.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme, mounted]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/favicon.svg" 
              alt="ChromaStudio" 
              width={40} 
              height={40}
              className="w-10 h-10 rounded-xl"
            />
            <div>
              <h1 className="font-bold text-lg text-text-primary">ChromaStudio</h1>
              <p className="text-xs text-text-muted">Color Toolkit</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/generator" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Generator
            </Link>
            <Link href="/explore" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Explore
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary"
            >
              {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link 
              href="/generator"
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
            >
              Try Now
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-pink-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl" />
          
          <div className="max-w-5xl mx-auto relative">
            <div className="flex justify-center mb-8">
              <div className="flex gap-3 p-3 rounded-2xl bg-bg-secondary/80 backdrop-blur border border-border shadow-xl">
                {colors.map((color, i) => (
                  <div 
                    key={i} 
                    className="w-12 h-12 rounded-xl shadow-md animate-pulse"
                    style={{ 
                      backgroundColor: color, 
                      animationDelay: `${i * 0.1}s`,
                      boxShadow: `0 4px 14px ${color}40`
                    }} 
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
                <Zap size={14} />
                Free & Open Source Forever
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-text-primary leading-tight">
                Create stunning{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-pink-500">
                  color palettes
                </span>
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                Generate beautiful color schemes with AI, extract colors from images, 
                check accessibility, and export to 12+ code formats.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/generator"
                  className="px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-accent/25 hover:scale-105"
                >
                  <Sparkles size={20} />
                  Generate Palette
                  <ArrowRight size={18} />
                </Link>
                <a 
                  href="#features"
                  className="px-8 py-4 rounded-xl bg-bg-secondary border border-border text-text-secondary font-semibold text-lg hover:bg-bg-tertiary transition-all hover:scale-105"
                >
                  See Features
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-text-primary">
                Everything for colors
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                A complete toolkit for designers and developers
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-8 rounded-3xl bg-bg-secondary border border-border hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <feature.icon size={26} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-text-primary">
                All Color Tools
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                8 powerful tools for all your color needs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent hover:bg-bg-tertiary transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                    <tool.icon size={22} className="text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{tool.label}</h3>
                  <p className="text-sm text-text-secondary">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-text-primary">
              Start creating now
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
              No sign-up, no limits. Just beautiful colors.
            </p>
            <Link 
              href="/generator"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent text-white font-semibold text-xl hover:opacity-90 transition-all shadow-xl shadow-accent/25 hover:scale-105"
            >
              <Sparkles size={24} />
              Open Generator
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon.svg" 
              alt="ChromaStudio" 
              width={40} 
              height={40}
              className="w-10 h-10 rounded-xl"
            />
            <span className="font-bold text-lg text-text-primary">ChromaStudio</span>
          </div>
          <p className="text-sm text-text-muted">
            Built with Next.js • Tailwind CSS • TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}