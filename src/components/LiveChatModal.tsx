import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Paperclip, 
  Download, 
  Building2, 
  User, 
  Clock, 
  ShieldCheck, 
  Maximize2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ChatThread } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeThreadMessages, 
  sendChatMessage, 
  getOrCreateThreadForCustomer,
  subscribeAdminChatThreads,
  subscribeCustomerThreads
} from '../services/firestoreService';
import { processFileForChat } from '../utils/fileUtils';

interface LiveChatModalProps {
  initialThreadId?: string;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  initialThreadId,
  onClose,
  onOpenAuth
}) => {
  const { user, isAdmin } = useAuth();
  
  const [activeThreadId, setActiveThreadId] = useState<string>(initialThreadId || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminThreads, setAdminThreads] = useState<ChatThread[]>([]);
  const [customerThreads, setCustomerThreads] = useState<ChatThread[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [pendingFile, setPendingFile] = useState<{ url: string; name: string; size: string; type: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialThreadId whenever it changes (e.g., opened from different property)
  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId]);

  // Subscribe to threads
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      const unsub = subscribeAdminChatThreads((threads) => {
        setAdminThreads(threads);
        if (threads.length > 0 && !activeThreadId) {
          setActiveThreadId(threads[0].id);
        }
      });
      return () => unsub();
    } else {
      const unsub = subscribeCustomerThreads(user.uid, (threads) => {
        setCustomerThreads(threads);
      });

      if (!activeThreadId) {
        getOrCreateThreadForCustomer(user.uid, user.email, user.displayName || user.email)
          .then((id) => setActiveThreadId(id))
          .catch(console.error);
      }
      return () => unsub();
    }
  }, [user, isAdmin, activeThreadId]);

  // Subscribe to messages in active thread
  useEffect(() => {
    if (!activeThreadId) return;
    const unsub = subscribeThreadMessages(activeThreadId, (newMessages) => {
      setMessages(newMessages);
    });
    return () => unsub();
  }, [activeThreadId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    try {
      const processed = await processFileForChat(file);
      setPendingFile(processed);
    } catch (err: any) {
      setFileError(err?.message || 'Failed to process file. Please ensure it is under 5MB.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!inputText.trim() && !pendingFile) || !activeThreadId) return;

    setSending(true);
    setFileError(null);
    try {
      const isImg = pendingFile?.type.startsWith('image/');
      const msgType = pendingFile ? (isImg ? 'image' : 'document') : 'text';

      await sendChatMessage(
        activeThreadId,
        user.uid,
        user.email,
        user.displayName || user.email,
        isAdmin ? 'admin' : 'customer',
        inputText.trim(),
        msgType,
        pendingFile ? { url: pendingFile.url, name: pendingFile.name, size: pendingFile.size } : undefined,
        {
          customerId: user.uid,
          customerEmail: user.email,
          customerName: user.displayName || user.email,
          propertyTitle: 'The Oakridge Executive Residence & Private Grounds'
        }
      );

      setInputText('');
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Failed to send message:', err);
      setFileError('Failed to deliver message. Please retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0b101b] border border-[#c5a880]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col text-slate-100">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#070b16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8c6a38] to-[#dec58e] flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Executive Management Live Negotiation
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Secure Session
                </span>
              </div>
              <p className="text-xs text-[#dec58e]">
                Direct line to Executive Management Desk • Private Client Acquisitions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fileError && (
          <div className="p-3 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between px-4">
            <span>{fileError}</span>
            <button onClick={() => setFileError(null)} className="text-rose-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* If user is not logged in: Prompt to Sign In */}
        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[#dec58e] border border-[#c5a880]/30">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Authentication Required for Live Negotiation
            </h3>
            <p className="text-sm text-slate-300 max-w-md">
              To exchange real estate offers, pictures, and acquisition contracts directly with Executive Management, please sign in or register your client account.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-[#c5a880]/20 flex items-center gap-2"
            >
              <span>Sign In / Create Client Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Admin Thread Sidebar (If Admin is viewing) */}
            {isAdmin && adminThreads.length > 0 && (
              <div className="w-64 sm:w-72 border-r border-white/10 bg-[#070b16] flex flex-col hidden sm:flex">
                <div className="p-3 border-b border-white/10 text-xs font-semibold text-[#dec58e] uppercase tracking-wider">
                  Client Inquiries ({adminThreads.length})
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {adminThreads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full text-left p-3 text-xs transition-colors ${
                        activeThreadId === thread.id
                          ? 'bg-[#18233c] text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white truncate max-w-[130px]">
                          {thread.customerName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#dec58e] truncate mb-0.5">
                        {thread.propertyTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {thread.lastMessage}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Chat Stream Container */}
            <div className="flex-1 flex flex-col bg-[#0b101b] overflow-hidden">
              
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Security intro banner */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-400 max-w-md mx-auto flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#dec58e]" />
                  <span>End-to-end client negotiation desk. All documents and images are strictly confidential.</span>
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#c5a880]/10 flex items-center justify-center text-[#dec58e] mx-auto border border-[#c5a880]/20">
                      <Send className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-white">Start the Discussion</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Send a message, attach photos of interest, or upload bank guarantees/escrow documents directly to Management.
                    </p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isMe = msg.senderId === user.uid;
                  const isManagement = msg.senderRole === 'admin';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender label */}
                      <span className="text-[11px] text-slate-400 mb-1 px-1 flex items-center gap-1">
                        {isManagement ? (
                          <strong className="text-[#dec58e] flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Aura Management
                          </strong>
                        ) : (
                          <span>{msg.senderName}</span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>

                      {/* Message Box */}
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-md ${
                          isMe
                            ? 'bg-[#c5a880] text-slate-950 font-normal rounded-tr-none'
                            : isManagement
                              ? 'bg-[#18233c] text-white border border-[#c5a880]/40 rounded-tl-none'
                              : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                        }`}
                      >
                        {/* Text message */}
                        {msg.content && (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        )}

                        {/* Image message */}
                        {msg.type === 'image' && msg.fileUrl && (
                          <div className={`mt-2 rounded-xl overflow-hidden border ${isMe ? 'border-slate-800' : 'border-white/10'}`}>
                            <div className="relative group cursor-pointer" onClick={() => setLightboxImageUrl(msg.fileUrl || null)}>
                              <img
                                src={msg.fileUrl}
                                alt="Attachment"
                                referrerPolicy="no-referrer"
                                className="w-full max-h-64 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Maximize2 className="w-6 h-6" />
                              </div>
                            </div>
                            {msg.fileName && (
                              <p className={`text-[10px] p-1.5 truncate ${isMe ? 'text-slate-800' : 'text-slate-400'}`}>
                                {msg.fileName} ({msg.fileSize})
                              </p>
                            )}
                          </div>
                        )}

                        {/* Document message */}
                        {msg.type === 'document' && msg.fileUrl && (
                          <div className={`mt-2 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            isMe ? 'bg-black/10 border-slate-900/20' : 'bg-slate-950 border-white/10'
                          }`}>
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText className={`w-5 h-5 flex-shrink-0 ${isMe ? 'text-slate-900' : 'text-[#dec58e]'}`} />
                              <div className="truncate">
                                <p className={`text-xs font-semibold truncate ${isMe ? 'text-slate-950' : 'text-white'}`}>
                                  {msg.fileName || 'Attached Document'}
                                </p>
                                <p className={`text-[10px] ${isMe ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {msg.fileSize || 'Document file'}
                                </p>
                              </div>
                            </div>

                            <a
                              href={msg.fileUrl}
                              download={msg.fileName || 'document'}
                              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                                isMe 
                                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                                  : 'bg-[#c5a880] text-slate-950 hover:bg-[#dec58e]'
                              }`}
                              title="Download Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Pending File Attachment Preview */}
              {pendingFile && (
                <div className="px-4 py-2 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pendingFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-[#dec58e]" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#dec58e]" />
                    )}
                    <span className="text-xs text-white font-medium truncate max-w-xs">
                      {pendingFile.name}
                    </span>
                    <span className="text-[10px] text-slate-400">({pendingFile.size})</span>
                  </div>
                  <button
                    onClick={() => {
                      setPendingFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/10 bg-[#070b16] flex items-center gap-2">
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                  className="hidden"
                />

                {/* Attach File / Picture Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-[#dec58e] transition-colors flex items-center gap-1 text-xs"
                  title="Attach Photo or Document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  placeholder="Type message, inquiry, or purchase condition..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#16223b] border border-slate-700 focus:border-[#c5a880] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={sending || (!inputText.trim() && !pendingFile)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dec58e] to-[#c5a880] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-md shadow-[#c5a880]/10"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        )}

      </div>

      {/* Image Lightbox Preview */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImageUrl}
              alt="Enlarged preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#dec58e]"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
