import React from 'react';
import { Bed, Bath, Square, MapPin, ArrowRight, MessageSquare, Camera } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
  onMakeArrangement: (property: Property) => void;
  onChatInquiry: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  onMakeArrangement,
  onChatInquiry
}) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Exclusive':
        return 'bg-[#c5a880]/20 text-[#dec58e] border-[#c5a880]/40';
      case 'Under Offer':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Sold':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="group rounded-2xl bg-[#0e1628] border border-slate-800/80 hover:border-[#c5a880]/60 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#c5a880]/10 flex flex-col">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.heroImage || property.images[0]?.url}
          alt={property.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/driveway.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-transparent to-black/30"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border backdrop-blur-md ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>

        {/* Photos Count Pill */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 border border-white/10">
          <Camera className="w-3.5 h-3.5 text-[#dec58e]" />
          <span>{property.images.length} Rooms</span>
        </div>

        {/* Price & Location bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#dec58e] uppercase tracking-wider block">
              Acquisition Value
            </span>
            <span className="font-serif text-2xl font-bold text-white drop-shadow">
              {formatPrice(property.price)}
            </span>
          </div>
          <span className="text-xs text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{property.location}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="font-serif text-xl font-bold text-white group-hover:text-[#dec58e] transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-light">
            {property.tagline || property.description}
          </p>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-4 border-y border-white/5 text-center text-slate-300">
            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-900/50">
              <span className="flex items-center gap-1 text-xs font-semibold text-white">
                <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
                {property.bedrooms} Beds
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Suites</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-900/50">
              <span className="flex items-center gap-1 text-xs font-semibold text-white">
                <Bath className="w-3.5 h-3.5 text-[#c5a880]" />
                {property.bathrooms} Baths
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Marble Baths</span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-900/50">
              <span className="flex items-center gap-1 text-xs font-semibold text-white">
                <Square className="w-3.5 h-3.5 text-[#c5a880]" />
                {property.sqft.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Sq. Ft.</span>
            </div>
          </div>

          {/* Room Highlights Preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {property.images.slice(0, 4).map((img, i) => (
              <span key={i} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                {img.roomType || 'Room'}
              </span>
            ))}
            {property.images.length > 4 && (
              <span className="text-[10px] bg-[#c5a880]/15 text-[#dec58e] px-2 py-0.5 rounded border border-[#c5a880]/30 font-medium">
                +{property.images.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 space-y-2">
          {/* Contact Management to Make Arrangements of Purchase */}
          <button
            onClick={() => onMakeArrangement(property)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#dec58e] via-[#c5a880] to-[#b08d4b] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#c5a880]/15 hover:scale-[1.01]"
          >
            <span>Make Purchase Arrangement</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProperty(property)}
              className="py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 text-xs font-medium transition-colors text-center"
            >
              Explore Full Tour
            </button>
            <button
              onClick={() => onChatInquiry(property)}
              className="py-2.5 px-3 rounded-lg bg-[#16223b] hover:bg-[#1f2f52] text-[#dec58e] border border-[#c5a880]/30 hover:border-[#c5a880] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
