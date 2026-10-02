import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  Mail, 
  Menu, 
  X, 
  FileText,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenChat: (threadId?: string) => void;
  onOpenMyArrangements: () => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenChat,
  onOpenMyArrangements,
  isAdminView,
  setIsAdminView,
  unreadCount = 0
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-[#c5a880]/20 text-slate-100 transition-all">
      {/* Top micro-bar */}
      <div className="bg-[#070b16] border-b border-white/5 py-1.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a 
              href="mailto:managementofficails001@gmail.com" 
              className="flex items-center gap-1.5 text-[#dec58e] hover:text-[#f5eedf] hover:underline transition-colors"
              title="Click to email Management directly"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Management: <strong className="text-white">managementofficails001@gmail.com</strong></span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Licensed Escrow & Acquisitions
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#dec58e] via-[#c5a880] to-[#8c6a38] flex items-center justify-center shadow-lg shadow-[#c5a880]/10 border border-[#f5eedf]/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-[#070b16]" />
            </div>
            <div>
              <span className="block font-serif text-2xl tracking-[0.2em] font-bold text-white uppercase group-hover:text-[#dec58e] transition-colors">
                AURA
              </span>
              <span className="block text-[10px] tracking-[0.3em] font-medium text-[#c5a880] uppercase">
                PRIME LUXURY ESTATES
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#estates" className="text-slate-300 hover:text-[#dec58e] transition-colors">
              Showcase Estates
            </a>
            <a href="#services" className="text-slate-300 hover:text-[#dec58e] transition-colors">
              Purchase Arrangements
            </a>
            <a href="#about" className="text-slate-300 hover:text-[#dec58e] transition-colors">
              Executive Management
            </a>
            
            {/* Customer Purchase Arrangements shortcut */}
            {user && (
              <button 
                onClick={onOpenMyArrangements}
                className="flex items-center gap-1.5 text-slate-300 hover:text-[#dec58e] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#dec58e]" />
                <span>My Offers & Arrangements</span>
              </button>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Live Chat with Management */}
            <button
              onClick={() => onOpenChat()}
              className="relative p-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-[#c5a880] text-slate-200 hover:text-[#dec58e] transition-colors flex items-center justify-center shadow-sm"
              title="Live Chat with Management"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a880] text-[#0a0f1d] font-bold text-xs rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin Toggle button (Visible if user is Management Admin) */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border ${
                  isAdminView
                    ? 'bg-[#c5a880] text-slate-950 border-[#f5eedf]'
                    : 'bg-[#18233c] text-[#dec58e] border-[#c5a880]/50 hover:bg-[#1f2f52]'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAdminView ? 'Exit Admin Mode' : 'Management Portal'}</span>
              </button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 hover:border-[#c5a880] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8c6a38] to-[#dec58e] flex items-center justify-center text-slate-950 font-bold text-xs">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-[#c5a880]/30 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          Super Management Admin
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenMyArrangements();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#dec58e]" />
                      <span>Purchase Arrangements</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenChat();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[#dec58e]" />
                      <span>Live Management Chat</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setIsAdminView(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-300 hover:bg-amber-500/10 flex items-center gap-2 font-medium"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-white/5 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#dec58e] to-[#c5a880] hover:from-[#f5eedf] hover:to-[#dec58e] text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#c5a880]/20 hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                <span>Client Portal / Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenChat()}
              className="p-2 text-slate-300 hover:text-white"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <a 
            href="#estates" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Showcase Estates
          </a>
          <a 
            href="#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Purchase Arrangements
          </a>
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 font-medium"
          >
            Executive Management
          </a>

          {user && (
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyArrangements();
              }}
              className="w-full text-left py-2 text-[#dec58e] font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>My Purchase Arrangements</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminView(!isAdminView);
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-center font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>{isAdminView ? 'Switch to Public Website' : 'Open Admin Management Portal'}</span>
            </button>
          )}

          <div className="pt-3 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Signed in</p>
                  <p className="text-sm font-semibold text-white">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-3 py-1.5 text-xs text-rose-400 border border-rose-500/30 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#dec58e] to-[#c5a880] text-slate-950 font-bold text-xs uppercase tracking-wider text-center"
              >
                Sign In / Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
