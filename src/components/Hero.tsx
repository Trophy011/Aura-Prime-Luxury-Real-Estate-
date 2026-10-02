import React from 'react';
import { Search, MapPin, DollarSign, BedDouble, Shield, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onExploreClick: () => void;
  onContactManagement: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  maxPrice,
  setMaxPrice,
  onExploreClick,
  onContactManagement
}) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#070b16] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background imagery with subtle gradient overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101b] via-[#070b16]/85 to-[#070b16]/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Curated Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dec58e]/10 border border-[#dec58e]/30 text-[#f5eedf] text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#dec58e]" />
          <span>Prime Residential Portfolios & Direct Acquisition</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Architectural Sanctuaries <br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#dec58e] via-[#c5a880] to-[#fbf8f2]">
            Acquired with Discretion.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          Direct private client negotiations with our executive management desk. 
          Review complete room-by-room architectural surveys, submit verified purchase arrangements, and collaborate in real-time.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-xl shadow-[#c5a880]/20 hover:scale-[1.02]"
          >
            <span>Explore Showcase Estates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onContactManagement}
            className="flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-[#c5a880]/40 hover:border-[#c5a880] font-semibold text-sm tracking-wide transition-all backdrop-blur-md"
          >
            <span>Contact Management Desk</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-5 rounded-2xl bg-[#0d1527]/90 border border-[#c5a880]/30 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            
            {/* Search Keyword */}
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#dec58e] uppercase mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Search Estate / Keyword</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Oakridge, Bel-Air, Garden Studio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Location selector */}
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#dec58e] uppercase mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location / Region</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="All">All Premier Locations</option>
                <option value="Surrey">Surrey / London Estates</option>
                <option value="Los Angeles">Bel Air / Los Angeles</option>
                <option value="Aspen">Aspen, Colorado</option>
              </select>
            </div>

            {/* Max Price Range */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-[#dec58e] uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Max Budget Cap</span>
                </label>
                <span className="text-xs font-bold text-white">
                  {maxPrice >= 1000000 ? `$${(maxPrice / 1000000).toFixed(1)}M` : `$${(maxPrice / 1000).toFixed(0)}K`}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="25000000"
                step="250000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#c5a880] h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$500K</span>
                <span>$12M</span>
                <span>$25M+</span>
              </div>
            </div>

          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto border-t border-white/10 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">$2.8B+ Closed</p>
              <p className="text-[11px] text-slate-400">Institutional track record</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Executive Desk</p>
              <p className="text-[11px] text-slate-400">Direct management access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e]">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bespoke Suites</p>
              <p className="text-[11px] text-slate-400">Complete room surveys</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Off-Market Access</p>
              <p className="text-[11px] text-slate-400">Strict buyer discretion</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
