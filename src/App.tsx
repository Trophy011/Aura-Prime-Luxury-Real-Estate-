import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  MessageSquare, 
  ArrowRight, 
  Award,
  Crown,
  ChevronRight
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Property } from './types';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { seedPropertiesIfEmpty, subscribeProperties } from './services/firestoreService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PurchaseArrangementModal } from './components/PurchaseArrangementModal';
import { LiveChatModal } from './components/LiveChatModal';
import { MyArrangementsModal } from './components/MyArrangementsModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function MainApp() {
  const { user, isAdmin } = useAuth();
  
  // Properties state
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [selectedType, setSelectedType] = useState<string>('All');

  // Modals state
  const [selectedPropertyForTour, setSelectedPropertyForTour] = useState<Property | null>(null);
  const [selectedPropertyForArrangement, setSelectedPropertyForArrangement] = useState<Property | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatThreadId, setChatThreadId] = useState<string | undefined>(undefined);
  const [isMyArrangementsOpen, setIsMyArrangementsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  
  // Admin View toggle
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Seed default properties and subscribe to Firestore
  useEffect(() => {
    seedPropertiesIfEmpty().catch(console.error);
    const unsub = subscribeProperties((data) => {
      setProperties(data);
    });
    return () => unsub();
  }, []);

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    // Search query matches title, description, or location
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      prop.title.toLowerCase().includes(q) || 
      prop.location.toLowerCase().includes(q) || 
      prop.description.toLowerCase().includes(q) ||
      prop.features.some(f => f.toLowerCase().includes(q));

    // City matches
    const matchesCity = selectedCity === 'All' || prop.city.toLowerCase() === selectedCity.toLowerCase();

    // Price matches
    const matchesPrice = prop.price <= maxPrice;

    // Property Type matches
    const matchesType = selectedType === 'All' || prop.propertyType === selectedType;

    return matchesSearch && matchesCity && matchesPrice && matchesType;
  });

  const featuredHouse = properties.find((p) => p.id === 'oakridge-residence') || properties[0];

  const handleMakeArrangement = (property: Property) => {
    if (!user) {
      setAuthTab('signup');
      setIsAuthOpen(true);
      return;
    }
    setSelectedPropertyForArrangement(property);
  };

  const handleChatInquiry = (property: Property) => {
    if (!user) {
      setAuthTab('signin');
      setIsAuthOpen(true);
      return;
    }
    setChatThreadId(user ? `thread_${user.uid}_${property.id}` : undefined);
    setIsChatOpen(true);
  };

  // If Admin is in Management Mode, show the Admin Dashboard
  if (isAdmin && isAdminView) {
    return (
      <AdminDashboard
        properties={properties}
        onCloseAdminView={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-[#c5a880]/30 selection:text-[#f3e5ab]">
      
      {/* Navigation */}
      <Navbar
        onOpenAuth={() => { setAuthTab('signin'); setIsAuthOpen(true); }}
        onOpenChat={(threadId) => { setChatThreadId(threadId); setIsChatOpen(true); }}
        onOpenMyArrangements={() => setIsMyArrangementsOpen(true)}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {/* Admin Mode Quick Access Alert Banner for Super Admin */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-3">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>
            You are authenticated as <strong>Executive Management Admin ({user?.email})</strong>.
          </span>
          <button
            onClick={() => setIsAdminView(true)}
            className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm hover:scale-105 transition-all"
          >
            Launch Management Control Center
          </button>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onExploreClick={() => {
          const el = document.getElementById('estates');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onContactManagement={() => {
          if (!user) {
            setIsAuthOpen(true);
          } else {
            setIsChatOpen(true);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-24 py-16">
        
        {/* Spotlight Featured Acquisition: $727,000 USD */}
        {featuredHouse && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0d1629] via-[#090e1c] to-[#121d36] border border-[#c5a880]/50 overflow-hidden shadow-2xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Photo Showcase & Mini Previews */}
                <div className="lg:col-span-7 space-y-4">
                  <div 
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group cursor-pointer shadow-lg"
                    onClick={() => setSelectedPropertyForTour(featuredHouse)}
                  >
                    <img
                      src={featuredHouse.heroImage}
                      alt={featuredHouse.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/driveway.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        Spotlight Acquisition
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-[#dec58e] border border-[#c5a880]/40 backdrop-blur-md">
                        12 Photos Available
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#dec58e] font-semibold">Front Paved Motor Court</p>
                        <p className="text-sm font-semibold text-white">42 Oakridge Crescent, Surrey Estates</p>
                      </div>
                      <span className="text-xs text-slate-300 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                        Click to Open 12-Room Gallery
                      </span>
                    </div>
                  </div>

                  {/* 4 Room Photo Previews */}
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                    {featuredHouse.images.slice(1, 5).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPropertyForTour(featuredHouse)}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-[#c5a880] cursor-pointer group"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/driveway.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                        <span className="absolute bottom-1 inset-x-1 text-[9px] text-white bg-black/70 px-1 py-0.5 rounded truncate text-center">
                          {img.roomType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Details & Price Banner */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#c5a880]/15 text-[#dec58e] border border-[#c5a880]/30">
                      Featured Executive Listing
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                      {featuredHouse.title}
                    </h3>
                    <p className="text-xs text-[#dec58e] font-medium">
                      {featuredHouse.tagline}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-5 rounded-2xl bg-[#070b16] border border-[#c5a880]/40 flex flex-col justify-center">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Official Acquisition Guide Price
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                        $727,000
                      </span>
                      <span className="text-sm font-bold text-[#dec58e] uppercase tracking-widest">
                        USD
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified Escrow Listing • Cash & Underwritten Wire Accepted
                    </p>
                  </div>

                  {/* Specs Pill List */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400 block">Bedrooms</span>
                      <span className="text-base font-bold text-white font-serif">{featuredHouse.bedrooms} Beds</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400 block">Bathrooms</span>
                      <span className="text-base font-bold text-white font-serif">{featuredHouse.bathrooms} Baths</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400 block">Living Area</span>
                      <span className="text-base font-bold text-white font-serif">{featuredHouse.sqft.toLocaleString()} Sq.Ft</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleMakeArrangement(featuredHouse)}
                        className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c5a880]/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                      >
                        <span>Arrange Purchase ($727,000 USD)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedPropertyForTour(featuredHouse)}
                        className="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <span>View 12 Photos</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleChatInquiry(featuredHouse)}
                      className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-[#c5a880]/60 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#dec58e]" />
                      <span>Live Negotiate with Management Desk</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </section>
        )}

        {/* Showcase Estates Section */}
        <section id="estates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#dec58e] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Prime Residential Portfolio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Showcase Architectural Estates
              </h2>
            </div>

            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Detached Residence', 'Modern Villa', 'Architectural Estate'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                    selectedType === type
                      ? 'bg-[#c5a880] text-slate-950 font-bold shadow-md shadow-[#c5a880]/20'
                      : 'bg-[#10192e] text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#0b101b] border border-white/10 text-center space-y-4">
              <Building2 className="w-12 h-12 text-[#dec58e]/40 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-white">
                No Properties Match Criteria
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Try widening your price cap, changing location filters, or resetting your search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setMaxPrice(25000000);
                  setSelectedType('All');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#c5a880] text-slate-950 font-bold text-xs uppercase"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelectProperty={(p) => setSelectedPropertyForTour(p)}
                  onMakeArrangement={(p) => handleMakeArrangement(p)}
                  onChatInquiry={(p) => handleChatInquiry(p)}
                />
              ))}
            </div>
          )}

        </section>

        {/* Purchase Arrangements & Direct Management Process */}
        <section id="services" className="bg-[#0b101b] border-y border-white/5 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dec58e]/10 text-[#dec58e] text-xs font-semibold uppercase tracking-widest border border-[#dec58e]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Executive Protocols</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Arrangements of Purchase & Direct Acquisition
              </h2>
              <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
                We remove intermediaries. Every transaction is coordinated directly by our Executive Management desk with strict legal escrow security.
              </p>
            </div>

            {/* 4-Step Process Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#070b16] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] font-serif text-xl font-bold group-hover:scale-110 transition-transform">
                  01
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Client Account Registration
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  To comply with AML/KYC escrow frameworks and protect off-market inventory, buyers register a secure client profile.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#070b16] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] font-serif text-xl font-bold group-hover:scale-110 transition-transform">
                  02
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Formal Purchase Arrangement
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Select your chosen estate and click "Make Purchase Arrangement" to submit offer amounts, wire structure, and financing proof.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#070b16] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] font-serif text-xl font-bold group-hover:scale-110 transition-transform">
                  03
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Exchange Documents & Pictures
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Use our live chat to transmit bank comfort letters, contracts, and view high-resolution property documentation in real time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#070b16] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] font-serif text-xl font-bold group-hover:scale-110 transition-transform">
                  04
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Executive Escrow Closing
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Management finalizes contract acceptance, coordinates title escrow deeds, and schedules private white-glove handover.
                </p>
              </div>

            </div>

            {/* Direct CTA box */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#141f38] via-[#0d1629] to-[#121c33] border border-[#c5a880]/40 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-[#dec58e]">
                  Ready to Propose an Acquisition?
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Speak Directly with Executive Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                  Contact our executive management desk directly at{' '}
                  <a 
                    href="mailto:managementofficails001@gmail.com" 
                    className="text-[#dec58e] hover:text-white underline font-semibold"
                    title="Click to email Management"
                  >
                    managementofficails001@gmail.com
                  </a>
                  {' '}or launch an instant live negotiation session.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthTab('signup');
                      setIsAuthOpen(true);
                    } else {
                      setIsChatOpen(true);
                    }
                  }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  Start Live Negotiation
                </button>
                {!user && (
                  <button
                    onClick={() => {
                      setAuthTab('signin');
                      setIsAuthOpen(true);
                    }}
                    className="px-6 py-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-semibold transition-colors"
                  >
                    Client Sign In
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* About Management & Trust Section */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#dec58e]">
                <Award className="w-4 h-4" />
                <span>Executive Management Desk</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Discretion. Precision. <br />
                Direct Negotiation.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Aura Prime represents an elite tier of residential assets. Unlike traditional brokerage marketplaces where communications are delayed through layers of junior representatives, our platform connects qualified buyers directly to the principal management desk.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c5a880]/20 text-[#dec58e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Full Administrative Command</h4>
                    <p className="text-xs text-slate-400">Management oversees real-time messaging, offer approvals, and active listings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c5a880]/20 text-[#dec58e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Encrypted Document Exchange</h4>
                    <p className="text-xs text-slate-400">Proof of funds, inspection reports, and titles transmitted with confidential security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c5a880]/20 text-[#dec58e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Verified Title & Escrow Assurance</h4>
                    <p className="text-xs text-slate-400">All acquisition agreements are backed by institutional international escrow attorneys.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                  <p className="text-lg font-bold text-[#dec58e] font-serif">$2.8B+</p>
                  <p className="text-[11px] text-slate-400">Global Sales</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                  <p className="text-lg font-bold text-[#dec58e] font-serif">100%</p>
                  <p className="text-[11px] text-slate-400">Private Escrow</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                  <p className="text-lg font-bold text-[#dec58e] font-serif">24/7</p>
                  <p className="text-[11px] text-slate-400">Executive Desk</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-[#c5a880]/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
                  alt="Management Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#0b101b]/90 border border-white/10 backdrop-blur-md space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#dec58e] block">
                    Direct Management Desk
                  </span>
                  <a 
                    href="mailto:managementofficails001@gmail.com" 
                    className="font-serif text-lg font-bold text-white hover:text-[#dec58e] hover:underline block"
                    title="Click to email Management directly"
                  >
                    managementofficails001@gmail.com
                  </a>
                  <p className="text-xs text-slate-400">
                    London Mayfair W1 • Beverly Hills CA • Zurich Private Bank Partner Desk
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer
        onOpenAuth={() => { setAuthTab('signin'); setIsAuthOpen(true); }}
        onOpenChat={() => {
          if (!user) {
            setIsAuthOpen(true);
          } else {
            setIsChatOpen(true);
          }
        }}
      />

      {/* MODALS */}

      {/* 1. Property Detail & Photo Tour Modal */}
      {selectedPropertyForTour && (
        <PropertyDetailModal
          property={selectedPropertyForTour}
          onClose={() => setSelectedPropertyForTour(null)}
          onMakeArrangement={(p) => handleMakeArrangement(p)}
          onChatInquiry={(p) => handleChatInquiry(p)}
        />
      )}

      {/* 2. Purchase Arrangement Modal */}
      {selectedPropertyForArrangement && (
        <PurchaseArrangementModal
          property={selectedPropertyForArrangement}
          onClose={() => setSelectedPropertyForArrangement(null)}
          onOpenAuth={() => {
            setAuthTab('signup');
            setIsAuthOpen(true);
          }}
          onOpenChat={(threadId) => {
            setChatThreadId(threadId);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* 3. Live Chat & Document Negotiation Modal */}
      {isChatOpen && (
        <LiveChatModal
          initialThreadId={chatThreadId}
          onClose={() => setIsChatOpen(false)}
          onOpenAuth={() => {
            setAuthTab('signin');
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* 4. Customer's Active Arrangements Viewer Modal */}
      {isMyArrangementsOpen && (
        <MyArrangementsModal
          onClose={() => setIsMyArrangementsOpen(false)}
          onOpenChat={(threadId) => {
            setIsMyArrangementsOpen(false);
            setChatThreadId(threadId);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* 5. Client Authentication & Management Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
