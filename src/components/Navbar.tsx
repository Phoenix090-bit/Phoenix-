import React from 'react';
import { Store, Settings, Sparkles, Building2 } from 'lucide-react';
import { BusinessProfile } from '../types';

interface NavbarProps {
  business: BusinessProfile;
  onOpenSettings: () => void;
  onOpenAdvisor: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  business,
  onOpenSettings,
  onOpenAdvisor,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0B192C] text-white shadow-md border-b border-[#1E3E62]">
      <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Brand identity with Gold Accent */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#9A6B0A] flex items-center justify-center shadow-sm shrink-0 border border-[#F5D061]/40">
            <span className="font-extrabold text-[#0B192C] text-lg tracking-tighter">PB</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white truncate">
                Phoenix PocketBiz
              </span>
              <span className="bg-[#D4AF37]/20 text-[#F5D061] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase border border-[#D4AF37]/30">
                AI
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
              <Store className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="truncate max-w-[170px] sm:max-w-xs">{business.name}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1E3E62]/80 hover:bg-[#1E3E62] text-[#F5D061] text-xs font-semibold border border-[#D4AF37]/40 active:scale-95 transition-transform"
            title="Phoenix AI Business Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-200 active:scale-95 transition-colors"
            title="Business Settings & Backup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
