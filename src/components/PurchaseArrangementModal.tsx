import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  FileText, 
  Upload, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Paperclip,
  Calendar,
  Lock
} from 'lucide-react';
import { Property, PurchaseArrangement } from '../types';
import { useAuth } from '../context/AuthContext';
import { submitPurchaseArrangement, sendChatMessage } from '../services/firestoreService';

interface PurchaseArrangementModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenChat: (threadId?: string) => void;
}

export const PurchaseArrangementModal: React.FC<PurchaseArrangementModalProps> = ({
  property,
  onClose,
  onOpenAuth,
  onOpenChat
}) => {
  const { user } = useAuth();
  
  const [offerAmount, setOfferAmount] = useState<number>(property?.price || 5000000);
  const [offerType, setOfferType] = useState<PurchaseArrangement['offerType']>('All Cash Wire');
  const [preferredClosing, setPreferredClosing] = useState<string>('30 Days Standard');
  const [notes, setNotes] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>(user?.phone || '');
  
  // File upload state for documents/proof of funds
  const [fileData, setFileData] = useState<{ url: string; name: string; size: string; type: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!property) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be under 5MB for instant secure transmission.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      setFileData({
        url: result,
        name: file.name,
        size: sizeStr,
        type: file.type
      });
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (offerAmount <= 0) {
      setErrorMsg('Please specify a valid acquisition offer amount.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Submit arrangement to Firestore
      const arrangementId = await submitPurchaseArrangement({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.heroImage,
        askingPrice: property.price,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        userPhone: buyerPhone || '',
        offerAmount: Number(offerAmount),
        offerType,
        preferredClosing,
        notes: notes.trim(),
        documentName: fileData?.name,
        documentUrl: fileData?.url,
        documentType: fileData?.type
      });

      // Send automated message directly to the customer-management thread
      const threadId = `thread_${user.uid}_${property.id}`;
      const offerFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(offerAmount);
      
      await sendChatMessage(
        threadId,
        user.uid,
        user.email,
        user.displayName || user.email,
        'customer',
        `New Purchase Arrangement Proposal submitted for "${property.title}". Proposed Acquisition: ${offerFormatted} (${offerType}, Closing: ${preferredClosing}). ${notes ? `Note: "${notes}"` : ''}`,
        fileData ? (fileData.type.startsWith('image/') ? 'image' : 'document') : 'text',
        fileData ? { url: fileData.url, name: fileData.name, size: fileData.size } : undefined
      );

      setSubmittedSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit purchase arrangement:', err);
      setErrorMsg(err.message || 'Failed to submit arrangement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b101b] border border-[#c5a880]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#070b16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] border border-[#c5a880]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Make Purchase Arrangement
              </h2>
              <p className="text-xs text-[#dec58e]">
                Direct Acquisition Proposal to Executive Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Target Property Summary */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a] border border-white/10">
            <img
              src={property.heroImage}
              alt={property.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-20 h-16 rounded-lg object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#dec58e] font-semibold block">
                Target Property
              </span>
              <h3 className="font-serif text-base font-bold text-white truncate">
                {property.title}
              </h3>
              <p className="text-xs text-slate-400">
                Guide Price: <strong className="text-white">{formatPrice(property.price)}</strong> • {property.bedrooms} Beds, {property.sqft.toLocaleString()} Sq.Ft
              </p>
            </div>
          </div>

          {/* If user is not signed in: Requirement Alert */}
          {!user ? (
            <div className="p-6 rounded-2xl bg-[#16223b] border border-[#c5a880]/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#dec58e] mx-auto border border-[#c5a880]/40">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Client Account Required to Purchase
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  In compliance with private escrow regulations and direct management communication, purchasers must hold a registered client account.
                </p>
              </div>

              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                <span>Sign In / Create Client Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : submittedSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Purchase Arrangement Transmitted
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your acquisition proposal has been received directly by Executive Management. A private negotiation room has been opened in your live chat.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat(`thread_${user.uid}_${property.id}`);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  Open Live Management Negotiation
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                >
                  Return to Estates
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Offer Amount */}
              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Proposed Acquisition Offer Amount (USD)</span>
                  <span className="text-white text-xs font-normal">
                    Guide: {formatPrice(property.price)}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#dec58e]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="100000"
                    step="50000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    required
                    className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl pl-10 pr-4 py-3 text-base font-semibold text-white focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setOfferAmount(property.price)}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    At Asking Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferAmount(Math.round(property.price * 0.95))}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    95% of Asking ({formatPrice(Math.round(property.price * 0.95))})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferAmount(Math.round(property.price * 1.02))}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Full Priority Offer (+2%)
                  </button>
                </div>
              </div>

              {/* Offer & Arrangement Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5">
                    Acquisition Structure
                  </label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as any)}
                    className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="All Cash Wire">All-Cash Wire Transfer (Expedited)</option>
                    <option value="Mortgage Financing">Private Bank Mortgage Pre-Approval</option>
                    <option value="Private Escrow">Private Escrow / Trust Mandate</option>
                    <option value="Private VIP Viewing">VIP Private Viewing & On-Site Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5">
                    Target Closing Schedule
                  </label>
                  <select
                    value={preferredClosing}
                    onChange={(e) => setPreferredClosing(e.target.value)}
                    className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="14 Days Rapid Wire">14 Days Rapid Wire Close</option>
                    <option value="30 Days Standard">30 Days Standard Escrow</option>
                    <option value="60 Days Custom">60 Days Flexible Close</option>
                    <option value="Immediate Upon Inspection">Immediate Upon In-Person Inspection</option>
                  </select>
                </div>
              </div>

              {/* Buyer Direct Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5">
                    Registered Purchaser
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.displayName || user.email}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5">
                    Direct Telephone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Document / Proof of Funds / Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Upload Proof of Funds / Document or ID Photo</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional but accelerates review</span>
                </label>

                {fileData ? (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <Paperclip className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-medium text-white truncate">{fileData.name}</p>
                        <p className="text-[10px] text-slate-400">{fileData.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileData(null)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-[#c5a880] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
                    <Upload className="w-6 h-6 text-[#dec58e] mb-1.5" />
                    <span className="text-xs font-medium text-slate-200">
                      Upload Bank Comfort Letter, Proof of Funds, or Passport Photo
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      PDF, JPG, PNG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Special Conditions / Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase tracking-wider mb-1.5">
                  Special Purchase Conditions / Message to Management
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="State any specific terms, entity purchase details, or request for private walkthrough..."
                  className="w-full bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-[#dec58e] via-[#c5a880] to-[#b08d4b] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl shadow-[#c5a880]/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting Arrangement...</span>
                  ) : (
                    <>
                      <span>Transmit Arrangement to Management</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#dec58e]" />
                  <span>Secure 256-bit encryption • Direct management dispatch</span>
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
