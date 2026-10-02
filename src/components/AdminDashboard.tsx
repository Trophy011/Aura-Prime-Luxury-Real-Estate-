import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  MessageSquare, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  X, 
  DollarSign, 
  Paperclip, 
  Download, 
  Send, 
  ShieldCheck, 
  Eye, 
  Crown,
  LogOut,
  Maximize2
} from 'lucide-react';
import { Property, PurchaseArrangement, ChatThread, ChatMessage, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeAllArrangements, 
  updateArrangementStatus, 
  subscribeAdminChatThreads, 
  subscribeThreadMessages, 
  sendChatMessage, 
  saveProperty, 
  deletePropertyDoc 
} from '../services/firestoreService';

interface AdminDashboardProps {
  properties: Property[];
  onCloseAdminView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onCloseAdminView
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'arrangements' | 'inbox' | 'properties'>('arrangements');
  
  // Arrangements State
  const [arrangements, setArrangements] = useState<PurchaseArrangement[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedArrangement, setSelectedArrangement] = useState<PurchaseArrangement | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  // Inbox & Chat State
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [threadMessages, setThreadMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [pendingFile, setPendingFile] = useState<{ url: string; name: string; size: string; type: string } | null>(null);
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Property Editor State
  const [isEditingProperty, setIsEditingProperty] = useState<boolean>(false);
  const [propertyFormData, setPropertyFormData] = useState<Partial<Property>>({});

  // Subscribe to arrangements
  useEffect(() => {
    const unsub = subscribeAllArrangements((data) => {
      setArrangements(data);
    });
    return () => unsub();
  }, []);

  // Subscribe to all chat threads
  useEffect(() => {
    const unsub = subscribeAdminChatThreads((data) => {
      setThreads(data);
      if (data.length > 0 && !activeThreadId) {
        setActiveThreadId(data[0].id);
      }
    });
    return () => unsub();
  }, [activeThreadId]);

  // Subscribe to messages in active thread
  useEffect(() => {
    if (!activeThreadId) return;
    const unsub = subscribeThreadMessages(activeThreadId, (msgs) => {
      setThreadMessages(msgs);
    });
    return () => unsub();
  }, [activeThreadId]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleStatusChange = async (id: string, newStatus: PurchaseArrangement['status']) => {
    try {
      await updateArrangementStatus(id, newStatus, adminNoteInput.trim() || undefined);
      setAdminNoteInput('');
      setSelectedArrangement(null);
    } catch (err) {
      console.error('Failed to update arrangement status:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      setPendingFile({
        url: result,
        name: file.name,
        size: sizeStr,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || (!chatInput.trim() && !pendingFile) || !user) return;

    setSendingMsg(true);
    try {
      const isImg = pendingFile?.type.startsWith('image/');
      const msgType = pendingFile ? (isImg ? 'image' : 'document') : 'text';

      await sendChatMessage(
        activeThreadId,
        user.uid,
        user.email,
        'Aura Executive Management',
        'admin',
        chatInput.trim(),
        msgType,
        pendingFile ? { url: pendingFile.url, name: pendingFile.name, size: pendingFile.size } : undefined
      );

      setChatInput('');
      setPendingFile(null);
    } catch (err) {
      console.error('Admin message error:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSavePropertyForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyFormData.title || !propertyFormData.price) return;

    const propId = propertyFormData.id || `prop_${Date.now()}`;
    const newProp: Property = {
      id: propId,
      title: propertyFormData.title || 'Exclusive Residence',
      tagline: propertyFormData.tagline || 'Prime Luxury Property',
      price: Number(propertyFormData.price),
      location: propertyFormData.location || 'Beverly Hills / London',
      city: propertyFormData.city || 'London',
      stateOrCountry: propertyFormData.stateOrCountry || 'United Kingdom',
      bedrooms: Number(propertyFormData.bedrooms) || 4,
      bathrooms: Number(propertyFormData.bathrooms) || 4,
      sqft: Number(propertyFormData.sqft) || 3500,
      lotSize: propertyFormData.lotSize || '0.5 Acres',
      yearBuilt: Number(propertyFormData.yearBuilt) || 2022,
      propertyType: propertyFormData.propertyType || 'Detached Residence',
      status: propertyFormData.status || 'Available',
      featured: true,
      heroImage: propertyFormData.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      images: propertyFormData.images && propertyFormData.images.length > 0 
        ? propertyFormData.images 
        : [{ url: propertyFormData.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', caption: 'Residence Exterior' }],
      description: propertyFormData.description || 'Exclusive luxury residence presented by Aura Management.',
      features: propertyFormData.features || [
        'Gated Security Access',
        'Private Swimming Pool',
        'Chef Gourmet Kitchen',
        'Primary Luxury Spa Bath'
      ],
      specs: {
        garage: propertyFormData.specs?.garage || '3-Car Garage',
        heating: propertyFormData.specs?.heating || 'Multi-Zone Radiant',
        cooling: propertyFormData.specs?.cooling || 'Central VRF Cooling',
        taxesYearly: propertyFormData.specs?.taxesYearly || '$18,000 / yr',
        hoaFee: propertyFormData.specs?.hoaFee || 'None'
      }
    };

    try {
      await saveProperty(newProp);
      setIsEditingProperty(false);
      setPropertyFormData({});
    } catch (err) {
      console.error('Failed to save property:', err);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to remove this property listing from the live website?')) {
      try {
        await deletePropertyDoc(id);
      } catch (err) {
        console.error('Delete property error:', err);
      }
    }
  };

  const filteredArrangements = statusFilter === 'All' 
    ? arrangements 
    : arrangements.filter((a) => a.status === statusFilter);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-[#0b101b] border-b border-[#c5a880]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-[#c5a880] flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Executive Management Control Center
                </h1>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-[#dec58e]">{user?.email || 'managementofficails001@gmail.com'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAdminView}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
            >
              <Eye className="w-4 h-4 text-[#dec58e]" />
              <span>View Public Website</span>
            </button>
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/30"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-[#0d1527] border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('arrangements')}
            className={`py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'arrangements'
                ? 'border-[#dec58e] text-[#dec58e]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Purchase Arrangements & Offers</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#c5a880]/20 text-[#dec58e]">
              {arrangements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'border-[#dec58e] text-[#dec58e]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Customer Inquiries & Chat</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#c5a880]/20 text-[#dec58e]">
              {threads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-[#dec58e] text-[#dec58e]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Properties Portfolio</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {properties.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: PURCHASE ARRANGEMENTS */}
        {activeTab === 'arrangements' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Incoming Acquisition Proposals
                </h2>
                <p className="text-xs text-slate-400">
                  Review offers, verify attached bank letters, and set arrangement terms
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter:</span>
                {['All', 'Pending', 'Negotiating', 'Accepted', 'Declined'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === s
                        ? 'bg-[#c5a880] text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filteredArrangements.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0b101b] border border-white/5 text-center text-slate-400">
                No purchase arrangements matching this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredArrangements.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0b101b] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#dec58e] font-semibold uppercase tracking-wider">
                            Proposal #{item.id.slice(-6)}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                          {item.propertyTitle}
                        </h3>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 text-[#dec58e] text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
                        >
                          <option value="Pending">Pending Review</option>
                          <option value="In Review">Under Review</option>
                          <option value="Negotiating">In Negotiation</option>
                          <option value="Accepted">Accepted Offer</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </div>
                    </div>

                    {/* Buyer & Offer Financials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0f172a] border border-white/5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Acquisition Offer:</span>
                        <span className="font-bold text-lg text-[#dec58e]">
                          {formatPrice(item.offerAmount)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Guide: {formatPrice(item.askingPrice)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Financing Structure:</span>
                        <span className="font-semibold text-white">{item.offerType}</span>
                        <span className="text-[10px] text-slate-400 block">Closing: {item.preferredClosing}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Purchaser Name:</span>
                        <span className="font-semibold text-white">{item.userName}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{item.userEmail}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Direct Contact:</span>
                        <span className="font-semibold text-white">{item.userPhone || 'Not provided'}</span>
                        <span className="text-[10px] text-emerald-400 block">Verified Client ID</span>
                      </div>
                    </div>

                    {/* Attached Proof of Funds or ID */}
                    {item.documentUrl && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          <Paperclip className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <div className="truncate">
                            <span className="text-white font-medium block truncate">
                              Proof of Funds: {item.documentName || 'Buyer_Financial_Proof'}
                            </span>
                            <span className="text-[10px] text-slate-400">Attached for verification</span>
                          </div>
                        </div>

                        <a
                          href={item.documentUrl}
                          download={item.documentName || 'proof_of_funds'}
                          className="px-3 py-1.5 rounded-lg bg-[#c5a880] text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-[#dec58e] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Document</span>
                        </a>
                      </div>
                    )}

                    {/* Purchaser Notes */}
                    {item.notes && (
                      <div className="p-3 rounded-lg bg-white/5 text-xs text-slate-300">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                          Client Notes & Conditions:
                        </span>
                        "{item.notes}"
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('inbox');
                            setActiveThreadId(`thread_${item.userId}_${item.propertyId}`);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#dec58e] text-xs font-semibold transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Reply to Client in Live Chat</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(item.id, 'Accepted')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                        >
                          Accept Offer
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'Negotiating')}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
                        >
                          Counter / Negotiate
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'Declined')}
                          className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIVE CUSTOMER INQUIRIES & CHAT */}
        {activeTab === 'inbox' && (
          <div className="h-[75vh] rounded-2xl bg-[#0b101b] border border-white/10 flex overflow-hidden shadow-2xl">
            
            {/* Sidebar Threads List */}
            <div className="w-80 border-r border-white/10 bg-[#070b16] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-white">
                  Client Negotiation Threads
                </h3>
                <span className="text-xs text-[#dec58e] font-semibold">
                  {threads.length} Active
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {threads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No active messages from customers yet.
                  </div>
                ) : (
                  threads.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveThreadId(t.id)}
                      className={`w-full text-left p-4 transition-colors ${
                        activeThreadId === t.id
                          ? 'bg-[#18233c] border-l-4 border-[#dec58e]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white truncate max-w-[150px]">
                          {t.customerName || t.customerEmail}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(t.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#dec58e] truncate mb-1">
                        {t.propertyTitle}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {t.lastMessage}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Stream Window */}
            <div className="flex-1 flex flex-col bg-[#0b101b]">
              {activeThread ? (
                <>
                  {/* Chat Top Bar */}
                  <div className="p-4 border-b border-white/10 bg-[#0d1527] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {activeThread.customerName} ({activeThread.customerEmail})
                      </h4>
                      <p className="text-xs text-[#dec58e]">
                        Subject: {activeThread.propertyTitle}
                      </p>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {threadMessages.map((m) => {
                      const isMeAdmin = m.senderRole === 'admin';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMeAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[11px] text-slate-400 mb-1 px-1">
                            {isMeAdmin ? 'Executive Management (You)' : m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div
                            className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                              isMeAdmin
                                ? 'bg-[#c5a880] text-slate-950 font-normal rounded-tr-none'
                                : 'bg-[#18233c] text-white border border-slate-700 rounded-tl-none'
                            }`}
                          >
                            {m.content && (
                              <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.content}</p>
                            )}

                            {/* Image Attachment */}
                            {m.type === 'image' && m.fileUrl && (
                              <div className="mt-2 rounded-xl overflow-hidden border border-black/20">
                                <img
                                  src={m.fileUrl}
                                  alt="Preview"
                                  onClick={() => setLightboxImageUrl(m.fileUrl || null)}
                                  className="w-full max-h-60 object-cover cursor-pointer hover:opacity-95"
                                />
                              </div>
                            )}

                            {/* Document Attachment */}
                            {m.type === 'document' && m.fileUrl && (
                              <div className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                                isMeAdmin ? 'bg-black/10 border-black/20' : 'bg-slate-950 border-white/10'
                              }`}>
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-xs truncate font-medium">{m.fileName}</span>
                                </div>
                                <a
                                  href={m.fileUrl}
                                  download={m.fileName || 'doc'}
                                  className="p-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pending file preview */}
                  {pendingFile && (
                    <div className="p-2.5 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-white">
                        <Paperclip className="w-4 h-4 text-[#dec58e]" />
                        <span>{pendingFile.name} ({pendingFile.size})</span>
                      </div>
                      <button onClick={() => setPendingFile(null)} className="text-slate-400 hover:text-rose-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Input Bar */}
                  <form onSubmit={handleAdminSendMessage} className="p-3 sm:p-4 border-t border-white/10 bg-[#070b16] flex items-center gap-2">
                    <label className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[#dec58e] cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Type response, counter-offer, or escrow instructions..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={sendingMsg || (!chatInput.trim() && !pendingFile)}
                      className="px-5 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#dec58e] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  Select a negotiation thread on the left to start communicating.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PROPERTIES PORTFOLIO MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Property Portfolio Listings
                </h2>
                <p className="text-xs text-slate-400">
                  Full control over active estates, pricing, room surveys, and acquisition statuses
                </p>
              </div>

              <button
                onClick={() => {
                  setPropertyFormData({
                    status: 'Available',
                    propertyType: 'Detached Residence',
                    bedrooms: 5,
                    bathrooms: 4,
                    sqft: 4500,
                    price: 5500000
                  });
                  setIsEditingProperty(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Estate</span>
              </button>
            </div>

            {/* Properties List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-2xl bg-[#0b101b] border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-slate-900">
                      <img
                        src={prop.heroImage}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/driveway.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-[#dec58e] border border-[#c5a880]/30 backdrop-blur-md">
                        {prop.status}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-serif text-lg font-bold text-white truncate">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-[#dec58e] font-bold">
                        {formatPrice(prop.price)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {prop.location} • {prop.bedrooms} Beds, {prop.bathrooms} Baths, {prop.sqft.toLocaleString()} Sq.Ft
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => {
                        setPropertyFormData(prop);
                        setIsEditingProperty(true);
                      }}
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#dec58e]" />
                      <span>Edit Listing</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(prop.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Property Edit / Add Modal */}
      {isEditingProperty && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0b101b] border border-[#c5a880]/50 rounded-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                {propertyFormData.id ? 'Edit Estate Listing' : 'Add New Estate Listing'}
              </h3>
              <button
                onClick={() => setIsEditingProperty(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertyForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                  Estate Title
                </label>
                <input
                  type="text"
                  required
                  value={propertyFormData.title || ''}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, title: e.target.value })}
                  placeholder="e.g. The Kensington Crown Villa"
                  className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                    Asking Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={propertyFormData.price || ''}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, price: Number(e.target.value) })}
                    placeholder="4850000"
                    className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                    Listing Status
                  </label>
                  <select
                    value={propertyFormData.status || 'Available'}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, status: e.target.value as any })}
                    className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={propertyFormData.bedrooms || 4}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, bedrooms: Number(e.target.value) })}
                    className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={propertyFormData.bathrooms || 4}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, bathrooms: Number(e.target.value) })}
                    className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                    Sq. Footage
                  </label>
                  <input
                    type="number"
                    value={propertyFormData.sqft || 4000}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, sqft: Number(e.target.value) })}
                    className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                  Location & Address
                </label>
                <input
                  type="text"
                  value={propertyFormData.location || ''}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, location: e.target.value })}
                  placeholder="42 Oakridge Crescent, Surrey Estates"
                  className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={propertyFormData.heroImage || ''}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, heroImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#dec58e] uppercase mb-1">
                  Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={propertyFormData.description || ''}
                  onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
                  placeholder="Detailed architectural overview..."
                  className="w-full bg-[#16223b] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProperty(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#c5a880] text-slate-950 font-bold text-xs uppercase"
                >
                  Save Listing to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox for admin */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImageUrl}
              alt="Enlarged"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-10 right-0 text-white"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
