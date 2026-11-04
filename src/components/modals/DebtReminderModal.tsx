import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ExternalLink, Phone } from 'lucide-react';
import { BusinessProfile, DebtRecord } from '../../types';
import { formatNaira, generateDebtReminderMessage, getWhatsAppLink } from '../../utils/formatters';

interface DebtReminderModalProps {
  debt: DebtRecord | null;
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DebtReminderModal: React.FC<DebtReminderModalProps> = ({
  debt,
  business,
  isOpen,
  onClose,
}) => {
  const [dialect, setDialect] = useState<'english' | 'pidgin'>('pidgin');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !debt) return null;

  const reminderText = generateDebtReminderMessage(debt, business, dialect);
  const whatsappUrl = getWhatsAppLink(debt.customerPhone, reminderText);

  const handleCopy = () => {
    navigator.clipboard.writeText(reminderText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B192C]">
              <MessageSquare className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Send Friendly Reminder</h2>
              <p className="text-xs text-slate-300">WhatsApp & SMS Debt Recovery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer and debt brief */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">{debt.customerName}</div>
              <div className="text-[11px] text-slate-500">{debt.customerPhone}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Balance Owed</div>
              <div className="text-sm font-extrabold text-rose-600 tabular-nums">
                {formatNaira(debt.remainingBalance)}
              </div>
            </div>
          </div>

          {/* Language Selector: English vs Pidgin */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Choose Tone & Language:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDialect('pidgin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  dialect === 'pidgin'
                    ? 'bg-white text-[#0B192C] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇳🇬 Nigerian Pidgin (Warm & Friendly)
              </button>
              <button
                type="button"
                onClick={() => setDialect('english')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  dialect === 'english'
                    ? 'bg-white text-[#0B192C] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Formal English (Corporate)
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span>Message Preview</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-[#0B192C] hover:text-[#D4AF37] flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
              {reminderText}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-transform"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="h-12 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
