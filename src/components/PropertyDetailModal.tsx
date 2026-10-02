import React, { useState } from 'react';
import { 
  X, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Camera, 
  Mail,
  Calculator
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onMakeArrangement: (property: Property) => void;
  onChatInquiry: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onMakeArrangement,
  onChatInquiry
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  if (!property) return null;

  const currentImage = property.images[activeImageIndex] || property.images[0] || { url: property.heroImage, caption: property.title };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Mortgage Calculator
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment = monthlyRate > 0 
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : principal / numberOfPayments;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0b101b] border border-[#c5a880]/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#070b16]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#dec58e] tracking-wider uppercase font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{property.location}, {property.city}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">{property.status}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-white mt-1">
              {property.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* Main Photo Gallery Showcase */}
          <div className="space-y-3">
            {/* Active High-Res Photo Frame */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group">
              <img
                src={currentImage.url}
                alt={currentImage.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/driveway.jpg';
                }}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Room Tag */}
              {currentImage.roomType && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#dec58e] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#c5a880]/40">
                  {currentImage.roomType}
                </div>
              )}

              {/* Caption & Counter */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="text-sm sm:text-base font-medium text-white max-w-xl drop-shadow">
                  {currentImage.caption}
                </p>
                <span className="bg-black/60 backdrop-blur-md text-xs text-slate-300 px-3 py-1 rounded-full border border-white/10">
                  {activeImageIndex + 1} / {property.images.length} Photos
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#dec58e] ring-2 ring-[#c5a880]/50 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/driveway.jpg';
                    }}
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white text-center py-0.5 truncate px-1">
                    {img.roomType || `Photo ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Primary Action Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111c33] via-[#0d1629] to-[#151f36] border border-[#c5a880]/40 flex flex-wrap items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#dec58e] font-semibold block">
                Guide Acquisition Price
              </span>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {formatPrice(property.price)}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Direct management representation • Private Escrow Eligible • Immediate Arrangement Access
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onMakeArrangement(property);
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#c5a880]/20 hover:scale-[1.02]"
              >
                <span>Make Purchase Arrangement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onChatInquiry(property);
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#dec58e] border border-[#c5a880]/40 text-xs font-semibold tracking-wide transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Live Management Negotiation</span>
              </button>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 text-center">
              <Bed className="w-6 h-6 text-[#dec58e] mx-auto mb-1" />
              <span className="text-lg font-bold text-white">{property.bedrooms} Bedrooms</span>
              <span className="text-xs text-slate-400 block">En-Suite & Dressing</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 text-center">
              <Bath className="w-6 h-6 text-[#dec58e] mx-auto mb-1" />
              <span className="text-lg font-bold text-white">{property.bathrooms} Bathrooms</span>
              <span className="text-xs text-slate-400 block">Italian Marble & Soaking</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 text-center">
              <Square className="w-6 h-6 text-[#dec58e] mx-auto mb-1" />
              <span className="text-lg font-bold text-white">{property.sqft.toLocaleString()} Sq.Ft</span>
              <span className="text-xs text-slate-400 block">Living Space</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 text-center">
              <ShieldCheck className="w-6 h-6 text-[#dec58e] mx-auto mb-1" />
              <span className="text-lg font-bold text-white">{property.lotSize || '0.5+ Acre'}</span>
              <span className="text-xs text-slate-400 block">Private Grounds</span>
            </div>
          </div>

          {/* Architectural Narrative Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white">
              Architectural Profile & Residence Overview
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Key Features & Amenities */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              Property Amenities & Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#dec58e] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              Technical & Estate Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Garaging & Driveway:</span>
                  <span className="text-white font-medium">{property.specs.garage}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Heating System:</span>
                  <span className="text-white font-medium">{property.specs.heating}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Cooling & Air Treatment:</span>
                  <span className="text-white font-medium">{property.specs.cooling}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Year Completed:</span>
                  <span className="text-white font-medium">{property.yearBuilt || 2022}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Yearly Property Taxes:</span>
                  <span className="text-white font-medium">{property.specs.taxesYearly}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Estate Management / HOA:</span>
                  <span className="text-white font-medium">{property.specs.hoaFee || 'None (Freehold)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mortgage & Acquisition Calculator */}
          <div className="p-6 rounded-2xl bg-[#0d1629] border border-[#c5a880]/30 space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-[#dec58e]" />
              <h3 className="font-serif text-xl font-bold">
                Private Financing & Acquisition Estimator
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Down Payment ({downPaymentPercent}%):
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-[#c5a880]"
                />
                <span className="text-sm font-semibold text-white">
                  {formatPrice((property.price * downPaymentPercent) / 100)}
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Estimated Interest Rate: {interestRate}%
                </label>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Loan Term: {loanTermYears} Years
                </label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value={15}>15-Year Fixed</option>
                  <option value={30}>30-Year Fixed</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Estimated Monthly Commitment</span>
                <span className="font-serif text-2xl font-bold text-[#dec58e]">
                  {formatPrice(monthlyPayment)} / month
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-light">
                *Subject to private underwriting, asset verification, and escrow clearance. Direct wire cash purchases waive all lender contingencies.
              </p>
            </div>
          </div>

          {/* Executive Management Desk Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#070b16] to-[#121c33] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8c6a38] to-[#dec58e] flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg">
                M
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Executive Management Desk</h4>
                <p className="text-xs text-[#dec58e]">Aura Private Client Acquisitions</p>
                <a 
                  href="mailto:managementofficails001@gmail.com" 
                  className="text-xs text-[#dec58e] hover:text-white hover:underline flex items-center gap-1.5 mt-0.5"
                  title="Click to email Management directly"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>managementofficails001@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onMakeArrangement(property);
                }}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#c5a880] hover:bg-[#dec58e] text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Arrange Purchase
              </button>
              <button
                onClick={() => {
                  onClose();
                  onChatInquiry(property);
                }}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Live Chat
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
