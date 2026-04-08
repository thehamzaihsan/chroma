'use client';

import { useState, useMemo } from 'react';
import { Search, Heart, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/Button';

const styleFilters = ['All', 'Warm', 'Cool', 'Pastel', 'Neon', 'Earth', 'Vintage', 'Dark'];
const sortOptions = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'popular', label: 'Most Saved', icon: Heart },
];

const samplePalettes = [
  { id: '1', name: 'Sunset Vibes', colors: ['#FF6B6B', '#FEC89A', '#FFD93D', '#6BCB77', '#4D96FF'], saves: 1243, author: 'ColorMaster' },
  { id: '2', name: 'Ocean Breeze', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#03045E'], saves: 892, author: 'DesignPro' },
  { id: '3', name: 'Forest Dawn', colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'], saves: 756, author: 'NatureLover' },
  { id: '4', name: 'Neon Nights', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'], saves: 2103, author: 'NeonDream' },
  { id: '5', name: 'Soft Blush', colors: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'], saves: 567, author: 'PastelQueen' },
  { id: '6', name: 'Midnight Purple', colors: ['#10002B', '#240046', '#3C096C', '#5A189A', '#7B2CBF'], saves: 1892, author: 'DarkSoul' },
  { id: '7', name: 'Autumn Leaves', colors: ['#BC4749', '#A7C957', '#6A994E', '#386641', '#F2E8CF'], saves: 654, author: 'FallFan' },
  { id: '8', name: 'Cyber Punk', colors: ['#00F5D4', '#00BBF9', '#9B5DE5', '#F15BB5', '#FEE440'], saves: 3421, author: 'TechGeek' },
  { id: '9', name: 'Muted Earth', colors: ['#8B7355', '#A0896C', '#B5A88C', '#D4C4A8', '#EDE5D4'], saves: 423, author: 'EarthyTones' },
  { id: '10', name: 'Cotton Candy', colors: ['#FFB5E8', '#FF9CEE', '#FFCCF9', '#FCC2FF', '#F6A6FF'], saves: 789, author: 'SweetTooth' },
  { id: '11', name: 'Deep Space', colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD'], saves: 1567, author: 'SpaceCadet' },
  { id: '12', name: 'Tropical Paradise', colors: ['#FF6F61', '#F7DC6F', '#58D68D', '#48C9B0', '#5DADE2'], saves: 934, author: 'IslandVibes' },
];

export default function ExplorePage() {
  const { currentPalette, setCurrentPalette, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [savedPalettes, setSavedPalettes] = useState<string[]>([]);

  const filteredPalettes = useMemo(() => {
    let result = [...samplePalettes];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.colors.some(c => c.toLowerCase().includes(query)) ||
        p.author.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'newest':
        result.reverse();
        break;
      case 'popular':
        result.sort((a, b) => b.saves - a.saves);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, sortBy]);

  const toggleSave = (id: string) => {
    setSavedPalettes(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const loadPalette = (colors: string[]) => {
    setCurrentPalette({
      ...currentPalette!,
      id: Math.random().toString(36).substring(2),
      colors: colors.map(hex => ({ id: Math.random().toString(36).substring(2), hex })),
      lockedIndices: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    addToast('Palette loaded!', 'success');
  };

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold font-heading">Explore Palettes</h1>
          <p className="text-sm text-text-muted">Browse millions of color schemes</p>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, color, or author..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border border-border focus:border-accent focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            {sortOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={sortBy === value ? 'primary' : 'secondary'}
                onClick={() => setSortBy(value)}
              >
                <Icon size={16} />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {styleFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPalettes.map((palette) => (
            <div 
              key={palette.id}
              className="group rounded-2xl bg-bg-secondary border border-border overflow-hidden hover:border-accent/50 transition-all cursor-pointer"
              onClick={() => loadPalette(palette.colors)}
            >
              <div className="flex h-32">
                {palette.colors.map((color) => (
                  <div
                    key={color}
                    className="flex-1 transition-transform group-hover:scale-y-105"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{palette.name}</h3>
                    <p className="text-xs text-text-muted">by {palette.author}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(palette.id);
                    }}
                    className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <Heart 
                      size={16} 
                      className={savedPalettes.includes(palette.id) ? 'fill-error text-error' : 'text-text-muted'} 
                    />
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                  <Heart size={12} />
                  {palette.saves.toLocaleString()} saves
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPalettes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No palettes found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
