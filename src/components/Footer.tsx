import React from 'react';
import { Building2, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAuth: () => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenChat }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-[#c5a880]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Upper Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#dec58e] to-[#8c6a38] flex items-center justify-center text-[#070b16] font-bold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl tracking-[0.2em] font-bold text-white uppercase block">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.3em] font-medium text-[#c5a880] uppercase block">
                  PRIME LUXURY ESTATES
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Curating sovereign residential compounds and architectural monuments for distinguished private clients, family offices, and institutions.
            </p>

            <div className="pt-2 text-xs text-[#dec58e] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed Escrow & Title Representation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Private Portfolios
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#estates" className="hover:text-[#dec58e] transition-colors">
                  The Oakridge Manor & Atelier
                </a>
              </li>
              <li>
                <a href="#estates" className="hover:text-[#dec58e] transition-colors">
                  The Bel-Air Horizon Glass Pavilion
                </a>
              </li>
              <li>
                <a href="#estates" className="hover:text-[#dec58e] transition-colors">
                  The Aspen Mountain Crest Chalet
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#dec58e] transition-colors">
                  Private Off-Market Acquisitions
                </a>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Acquisition Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenChat} className="hover:text-[#dec58e] transition-colors text-left">
                  Direct Live Negotiation Desk
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-[#dec58e] transition-colors">
                  Arrangements of Purchase
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#dec58e] transition-colors">
                  Private Escrow & Wire Clearance
                </a>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-[#dec58e] transition-colors text-left">
                  Client Portal Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Executive Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
              Executive Management Desk
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href="mailto:managementofficails001@gmail.com" 
                className="flex items-center gap-2 text-[#dec58e] hover:text-white hover:underline transition-colors py-1"
                title="Click to email Management directly"
              >
                <Mail className="w-3.5 h-3.5 text-[#dec58e] flex-shrink-0" />
                <span className="truncate">managementofficails001@gmail.com</span>
              </a>
              <p className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#dec58e] flex-shrink-0 mt-0.5" />
                <span>Mayfair, London W1K • 9601 Wilshire Blvd, Beverly Hills CA</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Aura Prime Luxury Estates Ltd. All international rights reserved. Confidential private client representations.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#dec58e] transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
