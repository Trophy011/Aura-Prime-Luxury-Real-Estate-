import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Download, 
  MessageSquare, 
  Building2,
  DollarSign
} from 'lucide-react';
import { PurchaseArrangement } from '../types';
import { useAuth } from '../context/AuthContext';
import { subscribeUserArrangements } from '../services/firestoreService';

interface MyArrangementsModalProps {
  onClose: () => void;
  onOpenChat: (threadId?: string) => void;
}

export const MyArrangementsModal: React.FC<MyArrangementsModalProps> = ({
  onClose,
  onOpenChat
}) => {
  const { user } = useAuth();
  const [arrangements, setArrangements] = useState<PurchaseArrangement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserArrangements(user.uid, (list) => {
      setArrangements(list);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: PurchaseArrangement['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case 'Negotiating':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> In Negotiation
          </span>
        );
      case 'Declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" /> Under Management Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b101b] border border-[#c5a880]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#070b16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] border border-[#c5a880]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                My Purchase Arrangements & Offers
              </h2>
              <p className="text-xs text-slate-400">
                Active proposals submitted directly to Executive Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading your purchase arrangements...
            </div>
          ) : arrangements.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                <Building2 className="w-8 h-8 text-[#c5a880]/40" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                No Active Purchase Arrangements
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                You have not submitted an acquisition proposal yet. Select any luxury residence from our showcase and click "Make Purchase Arrangement".
              </p>
            </div>
          ) : (
            arrangements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-[#c5a880]/40 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.propertyImage && (
                      <img
                        src={item.propertyImage}
                        alt={item.propertyTitle}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-16 h-14 rounded-lg object-cover border border-white/10"
                      />
                    )}
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {item.propertyTitle}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Submitted: {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {/* Offer Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Proposed Acquisition:</span>
                    <span className="font-bold text-[#dec58e] text-base">
                      {formatPrice(item.offerAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Structure:</span>
                    <span className="font-medium text-white">{item.offerType}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Closing Timeline:</span>
                    <span className="font-medium text-white">{item.preferredClosing}</span>
                  </div>
                </div>

                {/* Attached Document / Proof of Funds */}
                {item.documentUrl && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-[#dec58e] flex-shrink-0" />
                      <span className="text-white truncate">{item.documentName || 'Proof of Funds'}</span>
                    </div>
                    <a
                      href={item.documentUrl}
                      download={item.documentName || 'purchase_proof'}
                      className="px-2.5 py-1 rounded bg-[#c5a880]/20 hover:bg-[#c5a880]/30 text-[#dec58e] flex items-center gap-1 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                )}

                {/* Notes or Conditions */}
                {item.notes && (
                  <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg">
                    <strong className="text-slate-400 block text-[10px] uppercase">Notes:</strong>
                    "{item.notes}"
                  </div>
                )}

                {/* Admin notes if any */}
                {item.adminNotes && (
                  <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                    <strong className="text-amber-400 block text-[10px] uppercase">Management Response:</strong>
                    {item.adminNotes}
                  </div>
                )}

                {/* Open Chat with Management about this arrangement */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat(user ? `thread_${user.uid}_${item.propertyId}` : undefined);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#dec58e] text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Negotiation Thread</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
