import React, { useState } from 'react';
import { X, Building2, Phone, MapPin, CreditCard, Download, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface BusinessProfileModalProps {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: BusinessProfile) => void;
  onExportData: () => void;
  onImportData: (json: string) => boolean;
  onResetData: () => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  business,
  isOpen,
  onClose,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [name, setName] = useState(business.name);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [address, setAddress] = useState(business.address);
  const [tagline, setTagline] = useState(business.tagline || '');
  const [bankName, setBankName] = useState(business.bankDetails?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(business.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(business.bankDetails?.accountName || '');

  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      ownerName,
      phone,
      address,
      currency: '₦',
      tagline: tagline || undefined,
      bankDetails: accountNumber
        ? {
            bankName,
            accountNumber,
            accountName: accountName || ownerName,
          }
        : undefined,
    });
    onClose();
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = onImportData(importText);
    if (ok) {
      setImportStatus('success');
      setTimeout(() => {
        setShowImport(false);
        setImportStatus('idle');
        onClose();
      }, 1200);
    } else {
      setImportStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B192C]">
              <Building2 className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Business Settings</h2>
              <p className="text-xs text-slate-300">Shop profile, bank info & data backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[80vh]">
          {/* Shop Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Business / Store Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Owner & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Store Address / Market Location
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Store Motto / Tagline (Printed on Receipts)
            </label>
            <input
              type="text"
              placeholder="e.g. Quality Goods at Unbeatable Prices"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Bank Transfer Details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
              Bank Transfer Info (Shown on Receipts)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bank (e.g. Access / OPay)"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <input
              type="text"
              placeholder="Account Name (e.g. Amaka Eze)"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] rounded-xl font-bold text-xs shadow-md transition-all active:scale-98"
          >
            Save Business Information
          </button>

          {/* Backup & Restore Section */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Local Storage Backup & Data
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={onExportData}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#0B192C]" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImport(!showImport)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
              >
                <Upload className="w-3.5 h-3.5 text-[#0B192C]" />
                <span>Import JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all sales, expenses, and debts to default sample data?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold flex flex-col items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset Demo</span>
              </button>
            </div>

            {showImport && (
              <div className="p-3 bg-slate-100 rounded-xl space-y-2 border border-slate-200">
                <textarea
                  rows={3}
                  placeholder="Paste exported JSON backup code here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-[11px] font-mono"
                />
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="w-full py-1.5 bg-[#0B192C] text-white rounded-lg text-xs font-bold"
                >
                  Confirm Import
                </button>
                {importStatus === 'success' && (
                  <p className="text-xs text-emerald-600 font-bold text-center">Data restored successfully!</p>
                )}
                {importStatus === 'error' && (
                  <p className="text-xs text-rose-600 font-bold text-center">Invalid backup JSON file.</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
